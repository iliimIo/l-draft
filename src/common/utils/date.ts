export const formatDate = (day: Date): string => {
  let date, month

  const year = day.getFullYear()
  date = day.getDate()
  month = day.getMonth() + 1

  date = date.toString().padStart(2, '0')
  month = month.toString().padStart(2, '0')

  return `${year}-${month}-${date}`
}

export const formatTzUTC = (day: string): any => {
  const isDay: Date = new Date(new Date(day).getTime())
  const year = isDay.getFullYear()
  const month = isDay.getMonth()
  const date = isDay.getDate()
  const hour = isDay.getHours() - 7
  const minute = isDay.getMinutes()
  const second = isDay.getSeconds()

  return new Date(Date.UTC(year, month, date, hour, minute, second)).toISOString()
}

export const changeTimeZone = (date: string, timeZone: string): Date => {
  const day: Date = formatTzUTC(date)
  if (typeof day === 'string') {
    return new Date(
      new Date(day).toLocaleString('en-US', {
        timeZone
      })
    )
  }

  return new Date(
    day.toLocaleString('en-US', {
      timeZone
    })
  )
}
