const inputFile = Bun.file("src/2025/10/input.txt")
const inputRaw = await inputFile.text()

type ButtonConfig = {
  required: number[]
  joltage: number[]
  buttons: number[][]
}

const rows = inputRaw
  .split("\n")
  .filter((line) => line.trim().length > 0)
  .map((row) =>
    row.split(" ").reduce(
      (acc, value) => {
        if (value.startsWith("[")) {
          acc.required = value
            .replaceAll(/\[|\]/gm, "")
            .matchAll(/\#/gm)
            .toArray()
            .map((match) => match.index)
        }
        if (value.startsWith("(")) {
          acc.buttons.push(value.replaceAll(/\(|\)/gm, "").split(",").map(Number))
        }
        if (value.startsWith("{")) {
          acc.joltage = value.replaceAll(/\{|\}/gm, "").split(",").map(Number)
        }
        return acc
      },
      { required: [], buttons: [], joltage: [] } as ButtonConfig
    )
  )

function buildSmtForConfig(config: ButtonConfig): string {
  const { joltage, buttons } = config
  const m = joltage.length
  const n = buttons.length

  const lines: string[] = []

  lines.push("(set-option :produce-models true)")
  lines.push("(set-logic QF_LIA)")

  for (let j = 0; j < n; j++) {
    lines.push(`(declare-const x${j} Int)`)
    lines.push(`(assert (>= x${j} 0))`)
  }

  for (let i = 0; i < m; i++) {
    const terms: string[] = []
    for (let j = 0; j < n; j++) {
      if (buttons[j].includes(i)) {
        terms.push(`x${j}`)
      }
    }

    const rhs = joltage[i]
    if (terms.length === 0) {
      lines.push(`(assert (= 0 ${rhs}))`)
    } else if (terms.length === 1) {
      lines.push(`(assert (= ${terms[0]} ${rhs}))`)
    } else {
      lines.push(`(assert (= (+ ${terms.join(" ")} ) ${rhs}))`)
    }
  }

  lines.push("(declare-const total Int)")
  if (n === 0) {
    lines.push("(assert (= total 0))")
  } else if (n === 1) {
    lines.push("(assert (= total x0))")
  } else {
    const sum = ["+", ...Array.from({ length: n }, (_, j) => `x${j}`)].join(" ")
    lines.push(`(assert (= total (${sum})))`)
  }

  lines.push("(minimize total)")
  lines.push("(check-sat)")

  lines.push("(get-value (total))")
  lines.push("(exit)")

  return lines.join("\n")
}

async function solveConfigWithZ3(config: ButtonConfig): Promise<number> {
  const smt = buildSmtForConfig(config)

  const proc = Bun.spawn({
    cmd: ["z3", "-in"],
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
  })

  proc.stdin.write(smt)
  proc.stdin.end()

  const out = await new Response(proc.stdout).text()
  const err = await new Response(proc.stderr).text()

  if (err.trim().length > 0) {
    console.error("z3 stderr:", err)
  }

  if (!out.includes("sat")) {
    throw new Error("Z3 did not return sat:\n" + out)
  }

  const match = out.match(/\(total\s+([0-9]+)\)/)
  if (!match) {
    throw new Error("Could not parse total from Z3 output:\n" + out)
  }

  return parseInt(match[1], 10)
}

async function main() {
  console.time("elapsed")

  let sum = 0
  for (const cfg of rows) {
    const presses = await solveConfigWithZ3(cfg)
    sum += presses
  }

  console.log("Part 2:", sum)
  console.timeEnd("elapsed")
}

main()
