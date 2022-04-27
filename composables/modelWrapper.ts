import { computed, getCurrentInstance } from "vue"

export function useModel<Type>(
  propName = "modelValue",
  options: { type?: "object" | "array" } = {}
) {
  const vm = getCurrentInstance()!.proxy

  let valueToSet: any
  if (options.type === "object") {
    valueToSet = (value: object) => {
      return { ...value }
    }
  } else if (options.type === "array") {
    valueToSet = (value: any[]) => [...value]
  } else valueToSet = (value: any) => value

  return computed<Type>({
    get() {
      return vm!.$props[propName]
    },
    set(value) {
      vm!.$emit(`update:${propName}`, valueToSet(value))
    },
  })
}
