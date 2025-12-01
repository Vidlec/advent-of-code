const inputFile = Bun.file("src/2024/25/input.txt")
const inputRaw = await inputFile.text()

console.time("elapsed")

const getPinLengths = (grid: string[], isLock: boolean): number[] => {
  const rows = grid.length
  const cols = grid[0].length
  const pinLengths: number[] = []
  const target = isLock ? "#" : "."

  for (let col = 0; col < cols; col++) {
    let length = 0

    for (let row = 0; row < rows; row++) {
      if (grid[row][col] !== target) {
        break
      }
      length++
    }

    if (length > 0) {
      pinLengths.push(isLock ? length - 1 : cols - length + 1)
    }
  }

  return pinLengths
}

const lockOrKeys = inputRaw.split("\n\n").map((lockOrKey) => lockOrKey.split("\n"))

const { locks, keys } = lockOrKeys.reduce(
  (acc: { locks: number[][]; keys: number[][] }, lockOrKey) => {
    const isLock = lockOrKey[0] === "#####"
    const pins = getPinLengths(lockOrKey, isLock)
    isLock ? acc.locks.push(pins) : acc.keys.push(pins)
    return acc
  },
  { locks: [], keys: [] }
)

let fits = 0
locks.forEach((lock) => {
  keys.forEach((key) => {
    if (lock.every((l, index) => l + key[index] < 6)) fits++
  })
})

console.log("Part 1 and 2:", fits)
console.timeEnd("elapsed")
