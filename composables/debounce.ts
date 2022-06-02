// https://stackoverflow.com/q/66335997/3218806
export const debounce = (fn, delay: number) => {
  let timeout

  return (...args) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
