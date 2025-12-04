const inputFile = Bun.file("src/2025/04/input.txt")
const inputRaw = await inputFile.text()

const rows = inputRaw.split("\n").map((row) => row.split(""))

interface Direction {
  dx: number
  dy: number
}

const directions: Direction[] = [
  { dx: 1, dy: 0 }, // Right
  { dx: 0, dy: -1 }, // Down
  { dx: -1, dy: 0 }, // Left
  { dx: 0, dy: 1 }, // Up
  { dx: 1, dy: -1 }, // Diagonal Down-Right
  { dx: -1, dy: 1 }, // Diagonal Up-Left
  { dx: -1, dy: -1 }, // Diagonal Down-Left
  { dx: 1, dy: 1 }, // Diagonal Up-Right
]

const part1 = () => {
  let rolls = 0

  rows.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (cell !== "@") return

      let adjacentCount = 0
      directions.forEach(({ dx, dy }) => {
        if (rows[x + dx]?.[y + dy] === "@") adjacentCount++
      })

      if (adjacentCount < 4) {
        rolls++
      }
    })
  })

  console.log("Part 1: ", rolls)
}

const part2 = () => {
  let rolls = 0
  let toDeleteCount = 0

  while (rolls === 0 || toDeleteCount > 0) {
    rows.forEach((row, x) => {
      row.forEach((cell, y) => {
        if (cell === "x") {
          rows[x][y] = "."
          rolls++
          toDeleteCount--
        }

        if (cell !== "@") return

        let adjacentCount = 0
        directions.forEach(({ dx, dy }) => {
          if (rows[x + dx]?.[y + dy] === "@") adjacentCount++
        })

        if (adjacentCount < 4) {
          rows[x][y] = "x"
          toDeleteCount++
        }
      })
    })
  }

  console.log("Part 2: ", rolls)
}

console.time("elapsed")

part1()
part2()

console.timeEnd("elapsed")
