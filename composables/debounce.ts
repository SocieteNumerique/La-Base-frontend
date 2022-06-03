// https://stackoverflow.com/q/66335997/3218806
// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (fn: Function, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
