const inputFile = Bun.file("src/2025/12/input.txt")
const inputRaw = await inputFile.text()

console.time("elapsed")

const result = inputRaw
  .split("\n\n")
  .slice(6)[0]
  .split("\n")
  .filter((row) => {
    const [dimensions, presents] = row.split(":")
    const area = dimensions
      .split("x")
      .map(Number)
      .reduce((a, b) => Math.floor(a / 3) * Math.floor(b / 3))

    const presentsArea = presents
      .trim()
      .split(" ")
      .map(Number)
      .reduce((a, b) => a + b)

    return area >= presentsArea
  }).length

console.log("Part 1: ", result)

console.timeEnd("elapsed")
