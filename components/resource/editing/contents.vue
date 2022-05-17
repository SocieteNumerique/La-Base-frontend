<template>
  <div>
    <h6>Contenu</h6>
    <ContentGridViewSwitcher
      v-model="isGridView"
      v-model:enabled="isGridViewEnabled"
    />
    <ContentListEdit
      v-show="!(isGridView && isGridViewEnabled)"
      v-model="contentsBySection"
      @delete-content="onDeleteContent"
      @delete-section="onDeleteSection"
      @new-solo-content="newContentInNewSection"
      @new-section="newSection"
      @new-content-in-section="newContentInSection"
      @new-adhoc-section="createAdHocSectionForContent"
    />
    <client-only>
      <ContentGridEdit
        v-if="isGridViewEnabled"
        v-show="isGridView && isGridViewEnabled"
        v-model="contentsBySection"
        @delete-content="onDeleteContent"
        @delete-section="onDeleteSection"
        @new-solo-content="newContentInNewSection"
        @new-section="newSection"
        @new-content-in-section="newContentInSection"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "~/stores/resourceStore"
import { Content, SectionWithContent } from "~/composables/types"
import {
  getResourceContentsBySection,
  addSection,
  addContent,
  emptyContentBySection,
  deleteSection,
  deleteContent,
  updateSectionOrder,
  updateContent,
} from "~/composables/contentsHelper"

const resourceStore = useResourceStore()

const isGridViewEnabled = ref<boolean>(true) // TODO is computed from resource
const isGridView = ref<boolean>(false) // TODO

const contentsBySection = ref<SectionWithContent[]>(
  (await getResourceContentsBySection(resourceStore.currentId!)) ||
    emptyContentBySection
)

function nextOrder(list: { order: number; [key: symbol]: any }[]) {
  if (list.length === 0) return 0
  return list.slice(-1)[0].order! + 1
}

const nextSectionOrder = computed<number>(() => {
  return nextOrder(contentsBySection.value)
})

function nextContentOrder(sectionIndex: number): number {
  return nextOrder(contentsBySection.value[sectionIndex].contents)
}

async function newSection(sectionTitle: string) {
  const newSection = await addSection(
    resourceStore.currentId!,
    nextSectionOrder.value,
    sectionTitle
  )
  contentsBySection.value.push(newSection!)
}

async function newContentInNewSection(type: string) {
  const newSection = await addSection(
    resourceStore.currentId!,
    nextSectionOrder.value
  )
  const content = await addContent(
    type,
    0,
    resourceStore.currentId!,
    newSection!.id
  )
  newSection!.contents.push(content!)
  contentsBySection.value.push(newSection!)
}

async function createAdHocSectionForContent({
  prevSectionIndex,
  contentIndex,
  nextIndex,
}: {
  prevSectionIndex: number
  contentIndex: number
  nextIndex: number
}) {
  const newSection = await addSection(
    resourceStore.currentId!,
    nextSectionOrder.value
  )
  let content: any = contentsBySection.value[nextIndex]
  console.log({ content, prevSectionIndex, contentIndex })
  content = await updateContent({
    id: content!.id,
    section: newSection!.id,
  } as any as Content)
  newSection!.contents.push(content!)
  contentsBySection.value.splice(nextIndex, 1, newSection!)
  return updateSectionOrder(contentsBySection.value)
}

async function newContentInSection({
  type,
  sectionIndex,
}: {
  type: string
  sectionIndex: number
}) {
  const content = await addContent(
    type,
    nextContentOrder(sectionIndex),
    resourceStore.currentId!,
    contentsBySection.value[sectionIndex]!.id
  )
  contentsBySection.value[sectionIndex]!.contents.push(content!)
}

async function onDeleteContent({
  id,
  contentIndex,
  sectionIndex,
}: {
  id: number
  contentIndex: number
  sectionIndex: number
}) {
  if (contentsBySection.value[sectionIndex].contents.length === 1)
    return onDeleteSection(sectionIndex)
  if (await deleteContent(id))
    contentsBySection.value[sectionIndex].contents.splice(contentIndex, 1)
  // TODO display potential error
}

async function onDeleteSection(index: number) {
  const id = contentsBySection.value[index].id
  console.log({ index, id })
  if (await deleteSection(id)) contentsBySection.value.splice(index, 1)
  // TODO display potential error
}
</script>

<style scoped lang="sass"></style>
