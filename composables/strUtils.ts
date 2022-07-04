export function pluralize([singular, plural]: string[], nb: number): string {
  if (plural == null) {
    plural = `${singular}s`
  }
  return nb > 1 ? plural : singular
}

export const participantTypeCategoryName = "externalProducer_00occupation"
export const territoryCategoryName = "territory_00city"
