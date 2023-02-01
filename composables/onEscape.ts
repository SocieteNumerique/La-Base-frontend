import { onBeforeUnmount, onMounted } from "vue"

export function onEscape(hook: () => any, isFocused: () => boolean) {
  // detect clicks outside of tagSelector to blur it
  const onEscapeUp = (ev: KeyboardEvent) => {
    if (ev.key !== "Escape") {
      return
    }
    if (!isFocused()) {
      return
    }
    hook()
  }
  onMounted(() => {
    document.addEventListener("keyup", onEscapeUp)
  })
  onBeforeUnmount(() => {
    document.removeEventListener("keyup", onEscapeUp)
  })
}
