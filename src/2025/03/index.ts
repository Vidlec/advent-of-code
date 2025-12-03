const inputFile = Bun.file("src/2025/03/input.txt")
const inputRaw = await inputFile.text()

console.time("elapsed")

const banks = inputRaw.split("\n").map((bank) => bank.split("").map(Number))

const toJoltage = (digits: number) => (bank: number[]) => {
  if (digits <= 0) throw new Error("Digits must be positive")
  if (digits > bank.length) throw new Error("Not enough batteries in bank")

  const result: number[] = []
  let startIndex = 0

  for (let remaining = digits; remaining > 0; remaining--) {
    const lastStart = bank.length - remaining
    let bestDigit = 0
    let bestIndex = startIndex

    for (let i = startIndex; i <= lastStart; i++) {
      const digit = bank[i]
      if (digit > bestDigit) {
        bestDigit = digit
        bestIndex = i
        // * Bail early
        if (bestDigit === 9) break
      }
    }

    result.push(bestDigit)
    startIndex = bestIndex + 1
  }

  return Number(result.join(""))
}

console.log(
  "Part 1:",
  banks.map(toJoltage(2)).reduce((a, b) => a + b)
)

console.log(
  "Part 2:",
  banks.map(toJoltage(12)).reduce((a, b) => a + b)
)

console.timeEnd("elapsed")
