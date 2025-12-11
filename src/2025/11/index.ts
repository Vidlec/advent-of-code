const inputFile = Bun.file("src/2025/11/input.txt")
const inputRaw = await inputFile.text()

console.time("elapsed")

const map = new Map<string, string[]>(
  inputRaw.split("\n").map((line) => {
    const [key, rest] = line.split(": ")
    return [key, rest.split(" ")]
  })
)

const countPaths = (start: string, target: string, requiredNodes: string[] = []): number => {
  const requiredIndex = new Map<string, number>(requiredNodes.map((name, index) => [name, index]))

  const fullMask = requiredNodes.length === 0 ? 0 : (1 << requiredNodes.length) - 1
  const memo = new Map<string, number>()

  const getPath = (node: string, mask: number): number => {
    const index = requiredIndex.get(node)

    if (index !== undefined) {
      mask |= 1 << index
    }

    const targets = map.get(node)
    if (!targets || targets.length === 0) {
      return 0
    }

    if (targets[0] === target) {
      return (mask & fullMask) === fullMask ? 1 : 0
    }

    const key = `${node}|${mask}`
    const cached = memo.get(key)
    if (cached !== undefined) return cached

    let result = 0
    for (const next of targets) {
      result += getPath(next, mask)
    }

    memo.set(key, result)
    return result
  }

  return getPath(start, 0)
}

console.log("Part 1: ", countPaths("you", "out"))
console.log("Part 2: ", countPaths("svr", "out", ["fft", "dac"]))

console.timeEnd("elapsed")
