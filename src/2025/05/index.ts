const inputFile = Bun.file("src/2025/05/input.txt")
const inputRaw = await inputFile.text()

console.time("elapsed")

const [rangesBlock, idsBlock] = inputRaw.trim().split("\n\n")

const ranges = rangesBlock
  .split("\n")
  .map((line) => line.split("-").map(Number))
  .sort(([a], [b]) => a - b)

const merged: [number, number][] = []
let [currentFrom, currentTo] = ranges[0]

// * Merge ranges
for (let i = 1; i < ranges.length; i++) {
  const [from, to] = ranges[i]
  if (from <= currentTo) {
    if (to > currentTo) currentTo = to
    continue
  }
  merged.push([currentFrom, currentTo])
  currentFrom = from
  currentTo = to
}
merged.push([currentFrom, currentTo])

// * Binary search
const isInMergedRanges = (id: number) => {
  let low = 0
  let high = merged.length - 1

  while (low <= high) {
    const mid = (low + high) >> 1
    const [from, to] = merged[mid]
    if (id < from) {
      high = mid - 1
    } else if (id > to) {
      low = mid + 1
    } else {
      return true
    }
  }
  return false
}

const freshIdsCount = idsBlock.trim().split("\n").map(Number).filter(isInMergedRanges).length

console.log("Part 1:", freshIdsCount)

const count = merged.reduce((acc, [from, to]) => acc + (to - from + 1), 0)

console.log("Part 2:", count)

console.timeEnd("elapsed")
