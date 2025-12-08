const inputFile = Bun.file("src/2025/08/input.txt")
const inputRaw = await inputFile.text()

type Coords = [number, number, number]

console.time("elapsed")

const junctions: Coords[] = inputRaw
  .trim()
  .split("\n")
  .map((junction) => junction.split(",").map(Number) as Coords)

const getDistance = ([x1, y1, z1]: Coords, [x2, y2, z2]: Coords) => {
  const dx = x2 - x1
  const dy = y2 - y1
  const dz = z2 - z1
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

const disjointSet = (length: number) => {
  let parent = Array.from({ length }, (_, i) => i)
  let size = Array(length).fill(1)

  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]
      x = parent[x]
    }
    return x
  }

  const union = (a: number, b: number) => {
    let ra = find(a)
    let rb = find(b)
    if (ra === rb) return false

    if (size[ra] < size[rb]) {
      ;[ra, rb] = [rb, ra]
    }

    parent[rb] = ra
    size[ra] += size[rb]
    return true
  }

  return {
    find,
    union,
    getSize: () => size,
  }
}

type Edge = {
  from: number
  to: number
  distance: number
}

const edges: Edge[] = []

for (let i = 0; i < junctions.length; i++) {
  // * Start at i
  for (let j = i + 1; j < junctions.length; j++) {
    edges.push({
      from: i,
      to: j,
      distance: getDistance(junctions[i], junctions[j]),
    })
  }
}

edges.sort((a, b) => a.distance - b.distance)

const ds = disjointSet(junctions.length)
const MAX_CONNECTIONS = 1000
let connections = 0
let part2Result = 0

const circuits = new Map<number, number[]>()

for (const edge of edges) {
  connections++

  const { from, to } = edge

  if (!ds.union(from, to)) continue
  if (ds.getSize().some((value) => value === junctions.length)) {
    part2Result = junctions[edge.from][0] * junctions[edge.to][0]
    break
  }
  if (connections === MAX_CONNECTIONS) {
    for (let i = 0; i < junctions.length; i++) {
      const root = ds.find(i)
      const list = circuits.get(root) ?? []
      list.push(i)
      circuits.set(root, list)
    }
  }
}

console.log(
  "Part 1: ",
  [...circuits.values()]
    .map((indices) => indices.map((i) => junctions[i]).length)
    .sort((a, b) => b - a)
    .splice(0, 3)
    .reduce((a, b) => a * b)
)

console.log("Part 2: ", part2Result)

console.timeEnd("elapsed")
