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
