export const generateRandomId = () => Math.random().toString(36).slice(2, 10)

export const deepCopy = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj))
}
