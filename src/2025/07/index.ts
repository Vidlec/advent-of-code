const inputFile = Bun.file("src/2025/07/input.txt")
const inputRaw = await inputFile.text()

console.time("elapsed")

const grid = inputRaw
  .trimEnd()
  .split("\n")
  .map((row) => row.split(""))

const rows = grid.length
const cols = grid[0].length

const getStart = (): [number, number] => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "S") {
        return [r, c]
      }
    }
  }
  throw new Error("No start found")
}

const [startRow, startCol] = getStart()

const memo = new Map<string, number>()
const splitSet = new Set<string>()

const getKey = (row: number, column: number) => `${row},${column}`

const dfs = (row: number, column: number): number => {
  // * we are at the end
  if (row === rows - 1) return 1

  const key = getKey(row, column)
  const cached = memo.get(key)
  if (cached !== undefined) return cached

  const belowChar = grid[row + 1][column]
  let total = 0

  // * recursively go down the tree
  if (belowChar === ".") {
    total = dfs(row + 1, column)
  }

  if (belowChar === "^") {
    splitSet.add(`${row + 1},${column}`)
    if (column - 1 >= 0) total += dfs(row + 1, column - 1) // recurse left
    if (column + 1 < cols) total += dfs(row + 1, column + 1) // recurse right
  }

  memo.set(key, total)
  return total
}

const totalPaths = dfs(startRow, startCol)

console.log("Part 1: ", splitSet.size)
console.log("Part 2: ", totalPaths)
console.timeEnd("elapsed")
