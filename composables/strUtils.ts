export function pluralize([singular, plural]: string[], nb: number): string {
  if (plural == null) {
    plural = `${singular}s`
  }
  return nb > 1 ? plural : singular
}

export const stateLabel = {
  public: "Public",
  private: "Privé",
  draft: "Brouillon",
  restricted: "Restreint",
}
