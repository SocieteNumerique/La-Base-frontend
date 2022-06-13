import { onBeforeUnmount, onMounted } from "vue"

export function onFocusOut(
  hook: () => any,
  containerId: string,
  isFocused: () => boolean
) {
  // detect clicks outside of tagSelector to blur it
  const onClick = (ev: Event) => {
    if (!isFocused()) {
      return
    }
    const container = document.getElementById(containerId)
    if (!container!.contains(ev!.target as Node)) {
      hook()
    }
  }
  onMounted(() => {
    document.addEventListener("mouseup", onClick)
  })
  onBeforeUnmount(() => {
    document.removeEventListener("mouseup", onClick)
  })
}
