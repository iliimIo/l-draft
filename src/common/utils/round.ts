export const generateKeywordAward = (quantity: number, digit: number): string => {
  const result = []

  for (let i = 0; i < quantity; i++) {
    let award = ''
    for (let j = 1; j <= digit; j++) {
      award = award + 'x'
    }
    result.push(award)
  }
  return result.toString()
}

export const generateRoundRewardEndTime = (time: string): string => {
  return `${Number(time.substring(0, 2)) - 2}:00:00`
}
