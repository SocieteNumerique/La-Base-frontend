<template>
  <ContentInputBase
    :type="content.type"
    @exit="$emit('exit')"
    @save="saveContent"
  >
    <component :is="component" v-model="content" />
  </ContentInputBase>
</template>

<script lang="ts" setup>
import ContentInputLink from "~/components/content/input/link.vue"
import ContentInputText from "~/components/content/input/text.vue"
import ContentInputLinkedResource from "~/components/content/input/linkedResource.vue"
import { PropType } from "vue"
import { Content } from "~/composables/types"

defineEmits(["exit"])
defineProps({
  modelValue: { type: Object as PropType<Content>, required: true },
})
const content = useModel<Content>("modelValue", { type: "object" })

const componentByType: { [key: string]: unknown } = {
  text: ContentInputText,
  link: ContentInputLink,
  linkedResource: ContentInputLinkedResource,
}
const component = computed(() => componentByType[content.value.type])

async function saveContent() {
  return updateContent(content.value)
}
</script>

<style lang="sass" scoped>
.content-edit
  border: 1px solid var(--grey-975)
</style>
