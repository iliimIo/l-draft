export const formatDate = (day: Date): string => {
  let date, month, year

  date = day.getDate()
  month = day.getMonth() + 1
  year = day.getFullYear()

  date = date.toString().padStart(2, '0')
  month = month.toString().padStart(2, '0')

  return `${year}-${month}-${date}`
}
