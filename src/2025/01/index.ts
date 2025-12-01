const inputFile = Bun.file("src/2025/01/input.txt")
const inputRaw = await inputFile.text()

type Direction = "L" | "R"

console.time("elapsed")

const rotations = inputRaw
  .split("\n")
  .map(
    ([direction, ...rotation]) => [direction, parseInt(rotation.join(""))] as [Direction, number]
  )

const wrap = (value: number, direction: Direction, change: number) => {
  const delta = direction === "L" ? -Math.abs(change) : change

  const RANGE = 100
  const end = value + delta

  let wraps = Math.floor(end / RANGE)

  if (delta < 0 && end % RANGE === 0) wraps -= 1 // * landed exactly on 0 downward

  //* ignore the first wrap if we started exactly on 0
  if (value === 0 && wraps !== 0) {
    if (delta < 0) wraps += 1
  }

  const wrappedValue = ((end % RANGE) + RANGE) % RANGE

  return { newValue: wrappedValue, wraps: Math.abs(wraps) }
}

// * Part 1

const partOne = () => {
  let timesZero = 0
  let value = 50

  rotations.forEach(([direction, change]) => {
    const { newValue } = wrap(value, direction, change)

    value = newValue
    if (value === 0) {
      timesZero++
    }
  })
  console.log("Part 1: ", timesZero)
}

partOne()

// * Part 2

const partTwo = () => {
  let timesZero = 0
  let value = 50

  rotations.forEach(([direction, change]) => {
    const { newValue, wraps } = wrap(value, direction, change)

    value = newValue
    timesZero = timesZero + wraps
  })
  console.log("Part 2: ", timesZero)
}

partTwo()

console.timeEnd("elapsed")
