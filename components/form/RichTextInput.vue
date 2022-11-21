<template>
  <label v-if="label" class="fr-label" @click="editor.default.focus()">
    <!-- @slot Slot pour personnaliser tout le contenu de la balise <label> -->
    <slot name="label">
      {{ label }}
      <!-- @slot Slot pour indiquer que le champ est obligatoire. Par défaut, met une astérisque si `required` est à true (dans un `<span class="required">`) -->
      <slot name="required-tip">
        <span v-if="$attrs.required" class="required">&nbsp;*</span>
      </slot>
    </slot>

    <span v-if="hint" class="fr-hint-text">{{ hint }}</span>
  </label>

  <div
    :id="id"
    class="fr-input"
    :class="{
      'fr-input--error': isInvalid,
      'fr-input--valid': isValid,
    }"
    v-bind="$attrs"
  >
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
      <hr class="fr-pb-2w" />
      <editor-content :editor="editor" />
    </client-only>
    <DsfrModal :opened="isAddingLink" title="" @close="closeLinkModal">
      <DsfrInput
        v-model="correctedLink"
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

<script lang="ts" setup>
import { useEditor, EditorContent } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { PropType } from "vue"
import { Level } from "@tiptap/extension-heading"

const props = defineProps({
  id: {
    type: String,
    default() {
      return generateRandomId()
    },
  },
  modelValue: { type: String, required: true },
  toolbarOptions: {
    type: Object as PropType<{
      show: string[]
      headingSwitch: { [key: string]: Level }
    }>,
    default: () => {
      return {}
    },
  },
  isInvalid: Boolean,
  isValid: Boolean,
  label: {
    type: String,
    default: "",
  },
  labelClass: {
    type: String,
    default: "",
  },
  hint: {
    type: String,
    default: "",
  },
})

const modelValue = useModel<string>("modelValue")
const editor = useEditor({
  content: modelValue.value,
  extensions: [
    StarterKit,
    Link.configure({
      HTMLAttributes: {
        class: "no-append-ico",
      },
    }),
  ],
  onUpdate() {
    modelValue.value = editor.value!.getHTML()
  },
})
const testActiveHeading = (level: Level) =>
  editor.value?.isActive("heading", { level })
const onClickHeading = (level: Level) =>
  editor.value?.chain().focus().toggleHeading({ level: level }).run()

const defaultToolbar = () => [
  {
    name: "h1",
    testActive: () => testActiveHeading(1),
    onClick: () => onClickHeading(1),
    icon: "ri-h-1",
    disabled: () => false,
  },
  {
    name: "h2",
    testActive: () => testActiveHeading(2),
    onClick: () => onClickHeading(2),
    icon: "ri-h-2",
    disabled: () => false,
  },
  {
    name: "h3",
    testActive: () => testActiveHeading(3),
    onClick: () => onClickHeading(3),
    icon: "ri-h-3",
    disabled: () => false,
  },
  {
    name: "bold",
    testActive: () => editor.value?.isActive("bold"),
    onClick: () => editor.value!.chain().focus().toggleBold().run(),
    icon: "ri-bold",
    disabled: () => false,
  },
  {
    name: "italic",
    testActive: () => editor.value?.isActive("italic"),
    onClick: () => editor.value?.chain().focus().toggleItalic().run(),
    icon: "ri-italic",
    disabled: () => false,
  },
  {
    name: "list-ordered",
    testActive: () => editor.value?.isActive("orderedList"),
    onClick: () => editor.value?.chain().focus().toggleOrderedList().run(),
    icon: "ri-list-ordered",
    disabled: () => false,
  },
  {
    name: "list-unordered",
    testActive: () => editor.value?.isActive("bulletList"),
    onClick: () => editor.value?.chain().focus().toggleBulletList().run(),
    icon: "ri-list-unordered",
    disabled: () => false,
  },
  {
    name: "link",
    testActive: () => editor.value?.isActive("link"),
    onClick: () => openLinkModal(),
    icon: "ri-link",
    disabled: () => false,
  },
  {
    name: "link-unlink",
    testActive: () => !editor.value?.isActive("link"),
    onClick: () => editor.value?.chain().focus().unsetLink().run(),
    icon: "ri-link-unlink",
    disabled: () => !editor.value?.isActive("link"),
  },
]

const toolbarOptionsStrategy = {
  show: {
    test(toolbarOptions: any): boolean {
      return Boolean(toolbarOptions.show)
    },
    run(toolbar: any, toolbarOptions: any) {
      return toolbar.filter((toolbarItem: any) =>
        toolbarOptions.show.includes(toolbarItem.name)
      )
    },
  },
  headingSwitch: {
    test(toolbarOptions: any): boolean {
      return Boolean(toolbarOptions.headingSwitch)
    },
    run(toolbar: any, toolbarOptions: any) {
      return toolbar.map((toolbarItem: any) => {
        if (!toolbarOptions.headingSwitch[toolbarItem.name]) {
          return toolbarItem
        }
        return {
          ...toolbarItem,
          testActive: () =>
            testActiveHeading(toolbarOptions.headingSwitch[toolbarItem.name]),
          onClick: () =>
            onClickHeading(toolbarOptions.headingSwitch[toolbarItem.name]),
        }
      })
    },
  },
}

const getToolbar = (toolbarOptions: any) => {
  let newToolbar = defaultToolbar()
  Object.values(toolbarOptionsStrategy)
    .filter((strategy: any) => strategy.test(toolbarOptions))
    .forEach((strategy: any) => {
      newToolbar = strategy.run(newToolbar, toolbarOptions)
    })
  return newToolbar
}

const toolbar = ref(getToolbar(props.toolbarOptions))

const finalLabelClass = computed(() => {
  return ["fr-label", props.labelClass]
})

watch(
  () => modelValue.value,
  (value) => {
    const isSame = editor.value!.getHTML() === value
    if (isSame) return
    editor.value!.commands.setContent(value, false)
  }
)

watch(
  () => props.toolbarOptions,
  (value) => (toolbar.value = getToolbar(value))
)

const isAddingLink = ref<boolean>(false)
const linkToAdd = ref<string>("")
const correctedLink = computed<string>({
  get() {
    return linkToAdd.value
  },
  set(value) {
    if (/^https?:\/\/.*/.test(linkToAdd.value)) return (linkToAdd.value = value)
    linkToAdd.value = `http://${value || ""}`
  },
})

function openLinkModal() {
  if (!editor.value) return

  const previousUrl = editor.value.getAttributes("link").href
  correctedLink.value = previousUrl
  isAddingLink.value = true
}

function closeLinkModal() {
  correctedLink.value = ""
  isAddingLink.value = false
}

function setLink() {
  if (!editor.value) return

  // empty
  if (correctedLink.value === "") {
    editor.value.chain().focus().extendMarkRange("link").unsetLink().run()
    return
  }

  // update link
  editor.value
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: correctedLink.value })
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
