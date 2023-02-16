export const generateRandomId = () => Math.random().toString(36).slice(2, 10)

export const deepCopy = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj))
}

// https://stackoverflow.com/a/6470794/18661102
export function arrayMove<T>(arr: T[], fromIndex: number, toIndex: number) {
  const newArray = [...arr]
  const element = newArray[fromIndex]
  newArray.splice(fromIndex, 1)
  newArray.splice(toIndex, 0, element)
  return newArray
}

export function getLengthOrZero(value: string): number {
  return value?.length || 0
}

export const doNothing = (): void => {
  // do nothing
}

export const recommendationBadge = (recommendPct: number) => {
  {
    const pct = Math.round(recommendPct)
    if (recommendPct > 80) {
      return { type: "success", label: "Très recommandée", pct }
    }
    if (recommendPct > 60) {
      return { type: "new", label: "Recommandée", pct }
    }
    if (recommendPct > 40) {
      return { type: "new", label: "Moyennement recommandée", pct }
    }
    if (recommendPct > 20) {
      return { type: "warning", label: "Peu recommandée", pct }
    }
    return { type: "error", label: "Pas recommandée", pct }
  }
}
