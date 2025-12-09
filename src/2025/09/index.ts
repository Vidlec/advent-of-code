const inputFile = Bun.file("src/2025/09/input.txt")
const inputRaw = await inputFile.text()
type Point = [number, number]

import { Polygon } from "@flatten-js/core"

console.time("elapsed")

export function createRectangleFromCorners(a: Point, b: Point): Polygon {
  const [x1, y1] = a
  const [x2, y2] = b

  const points: Point[] = [
    [x1, y1],
    [x2, y1],
    [x2, y2],
    [x1, y2],
  ]

  return new Polygon(points)
}

const points = inputRaw.split("\n").map((tile) => tile.split(",").map(Number)) as Point[]

const boundingPolygon = new Polygon(points)

let largest = 0
let largestIncluded = 0

for (let i = 0; i < points.length; i++) {
  const [ax, ay] = points[i]

  console.log(`${i + 1}/${points.length}`)

  for (let j = i + 1; j < points.length; j++) {
    const [bx, by] = points[j]
    const rectangle = createRectangleFromCorners(points[i], points[j])

    const area = (Math.abs(ax - bx) + 1) * (Math.abs(ay - by) + 1)

    if (area > largest) largest = area
    if (area < largestIncluded) continue
    if (boundingPolygon.contains(rectangle)) largestIncluded = area
  }
}

console.log("Part 1: ", largest)
console.log("Part 2: ", largestIncluded)

console.timeEnd("elapsed")
