const inputFile = Bun.file("src/2025/02/input.txt")
const inputRaw = await inputFile.text()
const ranges = inputRaw.split(",").map((range) => range.split("-").map(Number))

console.time("elapsed")

let invalidIdsOne: number[] = []

const isValidPartOne = (id: string) => {
  if (id[0] === "0") return false
  if (id.length % 2) return true

  const sequenceLength = id.length / 2
  const start = id.slice(0, sequenceLength)
  const end = id.slice(sequenceLength, id.length)

  return start !== end
}

ranges.forEach(([from, to]) => {
  for (let i = from; i <= to; i++) {
    if (!isValidPartOne(i.toString())) invalidIdsOne.push(i)
  }
})

console.log(
  "Part 1: ",
  invalidIdsOne.reduce((a, b) => a + b)
)

const isValidPartTwo = (id: string) => {
  if (id[0] === "0") return false

  const doubled = id + id
  const inner = doubled.slice(1, -1)
  return !inner.includes(id)
}

let invalidIdsTwo: number[] = []

ranges.forEach(([from, to]) => {
  for (let i = from; i <= to; i++) {
    if (!isValidPartTwo(i.toString())) invalidIdsTwo.push(i)
  }
})

console.log(
  "Part 2: ",
  invalidIdsTwo.reduce((a, b) => a + b)
)

console.timeEnd("elapsed")
