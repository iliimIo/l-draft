export const generateNo = (total: number, numberOfItemsPerPage: number, page: number): any => {
  var start = page * numberOfItemsPerPage - (numberOfItemsPerPage - 1)
  var end = Math.min(start + numberOfItemsPerPage - 1, total)
  return { min: start, max: end }
}
