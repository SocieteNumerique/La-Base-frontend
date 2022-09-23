type Page = {
  label: string
  title: string
  href: string
}

export const paginationFromNResults = (
  nResults: number | null,
  pageSize = 12
): Page[] => {
  if (nResults == null) {
    return []
  }
  if (nResults <= pageSize) {
    return []
  }
  let nPages = Math.ceil(nResults / pageSize)
  nPages = Math.min(nPages, 10) // maximum 10 pages
  return [...Array(nPages).keys()]
    .map((number) => number + 1)
    .map((page) => ({
      label: String(page),
      title: `Page ${page}`,
      href: `?page=${page}`,
    }))
}