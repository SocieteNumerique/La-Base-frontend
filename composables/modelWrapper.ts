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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore typing is unknown because it is dynamic
      return vm!.$props[propName] as Type
    },
    set(value) {
      vm!.$emit(`update:${propName}`, valueToSet(value))
    },
  })
}
