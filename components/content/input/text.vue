<template>
  <div class="fr-input">
    <client-only>
      <div class="format-menu fr-btns-group--inline">
        <button
          v-for="(button, index) of toolbar"
          :key="index"
          :class="{ 'is-active': button.testActive() }"
          @click="button.onClick"
        >
          <VIcon :name="button.icon" />
        </button>
      </div>
      <editor-content :editor="editor" />
    </client-only>
    <DsfrModal :opened="isAddingLink" @close="closeLinkModal">
      <DsfrInput
        v-model="linkToAdd"
        :label-visible="true"
        label="URL"
        placeholder="https://"
        type="url"
      />

      <DsfrButtonGroup
        :buttons="linkEditButtons"
        :inline="true"
        align="right"
        class="fr-mt-4w"
        size="medium"
      />
    </DsfrModal>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { PropType } from "vue"
import { TextContent } from "~/composables/types"

defineProps({
  modelValue: { type: Object as PropType<TextContent>, required: true },
})
const content = useModel<TextContent>("modelValue", { type: "object" })
const editor = useEditor({
  content: content.value!.text,
  extensions: [
    StarterKit,
    Link.configure({
      HTMLAttributes: {
        class: "no-append-ico",
      },
    }),
  ],
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
    testActive: () => editor.value?.isActive("heading", { level: 4 }),
    onClick: () =>
      editor.value?.chain().focus().toggleHeading({ level: 4 }).run(),
    icon: "ri-h-1",
    disabled: () => false,
  },
  {
    testActive: () => editor.value?.isActive("heading", { level: 5 }),
    onClick: () =>
      editor.value?.chain().focus().toggleHeading({ level: 5 }).run(),
    icon: "ri-h-2",
    disabled: () => false,
  },
  {
    testActive: () => editor.value?.isActive("heading", { level: 6 }),
    onClick: () =>
      editor.value?.chain().focus().toggleHeading({ level: 6 }).run(),
    icon: "ri-h-3",
    disabled: () => false,
  },
  {
    testActive: () => editor.value?.isActive("bold"),
    onClick: () => editor.value!.chain().focus().toggleBold().run(),
    icon: "ri-bold",
    disabled: () => false,
  },
  {
    testActive: () => editor.value?.isActive("italic"),
    onClick: () => editor.value?.chain().focus().toggleItalic().run(),
    icon: "ri-italic",
    disabled: () => false,
  },
  {
    testActive: () => editor.value?.isActive("orderedList"),
    onClick: () => editor.value?.chain().focus().toggleOrderedList().run(),
    icon: "ri-list-ordered",
    disabled: () => false,
  },
  {
    testActive: () => editor.value?.isActive("bulletList"),
    onClick: () => editor.value?.chain().focus().toggleBulletList().run(),
    icon: "ri-list-unordered",
    disabled: () => false,
  },
  {
    testActive: () => editor.value?.isActive("link"),
    onClick: () => openLinkModal(),
    icon: "ri-link",
    disabled: () => false,
  },
  {
    testActive: () => !editor.value?.isActive("link"),
    onClick: () => editor.value?.chain().focus().unsetLink().run(),
    icon: "ri-link-unlink",
    disabled: () => !editor.value?.isActive("link"),
  },
]

const isAddingLink = ref<boolean>(false)
const linkToAdd = ref<string>("")

function openLinkModal() {
  if (!editor.value) return

  const previousUrl = editor.value.getAttributes("link").href
  linkToAdd.value = previousUrl
  isAddingLink.value = true
}

function closeLinkModal() {
  linkToAdd.value = ""
  isAddingLink.value = false
}

function setLink() {
  if (!editor.value) return

  // empty
  if (linkToAdd.value === "") {
    editor.value.chain().focus().extendMarkRange("link").unsetLink().run()
    return
  }

  // update link
  editor.value
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: linkToAdd.value })
    .run()
}

const linkEditButtons = ref([
  {
    label: "Annuler",
    icon: "ri-close-line",
    secondary: true,
    onClick: () => closeLinkModal(),
  },
  {
    label: "Valider",
    icon: "ri-check-line",
    onClick: () => {
      setLink()
      closeLinkModal()
    },
  },
])

onBeforeUnmount(() => editor.value!.destroy())
</script>

<style lang="sass" scoped>
.fr-input:not(textarea)
  max-height: revert

button:not(:disabled).is-active
  background-color: var(--active-tint)
</style>
