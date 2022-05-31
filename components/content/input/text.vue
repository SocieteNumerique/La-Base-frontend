<template>
  <div class="fr-input">
    <client-only>
      <div class="format-menu fr-btns-group--inline">
        <button
          v-for="(button, index) of toolbar"
          :key="index"
          :class="{ 'is-active': editor.isActive(...button.testActiveArgs) }"
          @click="button.onClick"
        >
          <VIcon :name="button.icon" />
        </button>
      </div>
      <editor-content :editor="editor" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import { PropType } from "vue"
import { TextContent } from "~/composables/types"

defineProps({
  modelValue: { type: Object as PropType<TextContent>, required: true },
})
const content = useModel<TextContent>("modelValue", { type: "object" })
const editor = useEditor({
  content: content.value!.text,
  extensions: [StarterKit],
  onUpdate() {
    content.value!.text = editor.value!.getHTML()
  },
})

watch(
  () => content.value!.text,
  (value) => {
    const isSame = editor.value!.getHTML() === value
    if (isSame) return
    editor.value!.commands.setContent(value, false)
  }
)

const toolbar = [
  {
    testActiveArgs: ["heading", { level: 4 }],
    onClick: () =>
      editor.value?.chain().focus().toggleHeading({ level: 4 }).run(),
    icon: "ri-h-1",
  },
  {
    testActiveArgs: ["heading", { level: 5 }],
    onClick: () =>
      editor.value?.chain().focus().toggleHeading({ level: 5 }).run(),
    icon: "ri-h-2",
  },
  {
    testActiveArgs: ["heading", { level: 6 }],
    onClick: () =>
      editor.value?.chain().focus().toggleHeading({ level: 6 }).run(),
    icon: "ri-h-3",
  },
  {
    testActiveArgs: ["bold"],
    onClick: () => editor.value!.chain().focus().toggleBold().run(),
    icon: "ri-bold",
  },
  {
    testActiveArgs: ["italic"],
    onClick: () => editor.value?.chain().focus().toggleItalic().run(),
    icon: "ri-italic",
  },
  {
    testActiveArgs: ["orderedList"],
    onClick: () => editor.value?.chain().focus().toggleOrderedList().run(),
    icon: "ri-list-ordered",
  },
  {
    testActiveArgs: ["bulletList"],
    onClick: () => editor.value?.chain().focus().toggleBulletList().run(),
    icon: "ri-list-unordered",
  },
]

onBeforeUnmount(() => editor.value!.destroy())
</script>

<style lang="sass" scoped>
.fr-input:not(textarea)
  max-height: revert

button:not(:disabled).is-active
  background-color: var(--active-tint)
</style>
