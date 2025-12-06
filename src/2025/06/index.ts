const inputFile = Bun.file("src/2025/06/input.txt")
const inputRaw = await inputFile.text()

console.time("elapsed")

const part1 = () => {
  const lines = inputRaw.split("\n").map((line) => line.split(" ").filter((value) => value !== ""))
  let problems = Array.from({ length: lines[0].length }).map((_, index) => {
    return lines.map((line) => line[index])
  })

  const results = problems.map((problems) => {
    const operation = problems[problems.length - 1]
    const numbers = problems.slice(0, problems.length - 1).map(Number)

    return numbers.reduce((a, b) => {
      if (operation === "+") return a + b
      if (operation === "*") return a * b
      return a
    })
  })

  console.log(
    "Part 1: ",
    results.reduce((a, b) => a + b)
  )
}

const part2 = () => {
  const lines = inputRaw.split("\n")
  let rowsCount = lines.length
  let columnsCount = lines[0].length

  const numbers = lines.slice(0, rowsCount)
  const operations = lines[rowsCount - 1]

  const cols: number[] = []
  for (let column = 0; column < columnsCount; column++) {
    let columnString = ""

    for (let row = 0; row < numbers.length - 1; row++) {
      columnString = columnString + numbers[row][column].trim()
    }

    if (!!columnString) cols.push(Number(columnString))
  }

  const matches = [...operations.matchAll(/([*+])(\s*)/g)]
  const columnsLengths = matches.map((m, index) => [
    index === matches.length - 1 ? m[2].length + 1 : m[2].length, // ! Fixes off one error for the last element
    m[0].trim(),
  ])

  const result = columnsLengths.map(([take, operation]) => {
    return cols.splice(0, take as number).reduce((a, b) => {
      if (operation === "+") return a + b
      if (operation === "*") return a * b
      return a
    })
  })

  console.log(
    "Part 2: ",
    result.reduce((a, b) => a + b)
  )
}

part1()
part2()

console.timeEnd("elapsed")
