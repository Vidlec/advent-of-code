const inputFile = Bun.file("src/2025/05/input.txt")
const inputRaw = await inputFile.text()

console.time("elapsed")

const [freshRangeRaw, ids] = inputRaw.split("\n\n").map((row) => row.split("\n"))
const freshRange = freshRangeRaw.map((range) => range.split("-").map(Number))

const freshIds = ids.map(Number).filter((id) => {
  return freshRange.some(([from, to]) => {
    return id >= from && id <= to
  })
})

console.log("Part 1: ", freshIds.length)

const sortedRanges = freshRange.sort(([a], [b]) => a - b)

let count = 0

for (let i = 0; i < sortedRanges.length; i++) {
  const [from, to] = sortedRanges[i]

  const next = sortedRanges[i + 1]
  if (!next) {
    count = count + (to - from) + 1
    break
  }

  const [nextFrom, nextTo] = next

  if (to >= nextFrom) {
    sortedRanges[i + 1][0] = from
    if (to >= nextTo) {
      sortedRanges[i + 1][1] = to
    }
    continue
  }

  count = count + (to - from) + 1
}

console.log("Part 2: ", count)

console.timeEnd("elapsed")
