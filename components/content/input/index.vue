<template>
  <ContentInputBase
    :type="content.type"
    @exit="$emit('exit')"
    @save="saveContent"
  >
    <component :is="component" v-model="content" />
    <ContentLicenseEdition v-model="content" />
  </ContentInputBase>
</template>

<script lang="ts" setup>
import ContentInputLink from "~/components/content/input/link.vue"
import ContentInputText from "~/components/content/input/text.vue"
import ContentInputLinkedResource from "~/components/content/input/linkedResource.vue"
import ContentInputFile from "~/components/content/input/file.vue"
import { PropType } from "vue"
import { Content } from "~/composables/types"

const emits = defineEmits(["exit"])
defineProps({
  modelValue: { type: Object as PropType<Content>, required: true },
})
const content = useModel<Content>("modelValue", { type: "object" })

const componentByType: { [key: string]: unknown } = {
  text: ContentInputText,
  link: ContentInputLink,
  linkedResource: ContentInputLinkedResource,
  file: ContentInputFile,
}
const component = computed(() => componentByType[content.value.type])

async function saveContent() {
  const updatedContent = await updateContent(content.value)
  if (!updatedContent) return
  content.value = updatedContent!
  emits("exit")
}
</script>

<style lang="sass" scoped>
.content-edit
  border: 1px solid var(--grey-975)
</style>
