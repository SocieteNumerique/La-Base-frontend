<template>
  <div>
    <h2 class="fr-h6">Ressource</h2>
    <p class="fr-mb-5w">Organiser vos contenus en liste et/ou en grille</p>
    <ContentGridViewSwitcher
      v-model="isGridView"
      :is-editing-mode="true"
      class="fr-mb-3w"
    />
    <hr class="fr-mt-5w" style="margin-bottom: -32px" />
    <ContentListEdit
      v-if="!(isGridView && isGridViewEnabled)"
      v-model="contentsBySection"
      v-model:editing-content="currentlyEditingContentId"
      @delete-content="onDeleteContent"
      @delete-section="onDeleteSection($event, true)"
      @auto-delete-section="onDeleteSection"
      @new-solo-content="newSoloContentInTheEnd"
      @new-section="createSection"
      @new-content-in-section="newContentInSection"
      @new-adhoc-section="createAdHocSectionForContent"
      @reload-contents="reloadContents"
    />
    <ContentGridEdit
      v-if="isGridView && isGridViewEnabled"
      v-model="contentsBySection"
      v-model:editing-content="currentlyEditingContentId"
      @delete-content="onDeleteContent"
      @delete-section="onDeleteSection($event, true)"
      @auto-delete-section="onDeleteSection"
      @new-solo-content="newSoloContentInTheEnd"
      @new-section="createSection"
      @new-content-in-section="newContentInSection"
      @reload-contents="reloadContents"
    />
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
  checkAndMerge,
  addContents,
} from "~/composables/contentsHelper"
import { useAlertStore } from "~/stores/alertStore"

const resourceStore = useResourceStore()

const isGridViewEnabled = computed<boolean>(
  () => resourceStore?.current?.isGridViewEnabled || false
)
const isGridView = ref<boolean>(false)
watch(isGridView, () => (currentlyEditingContentId.value = null))

const contentsBySection = ref<SectionWithContent[]>(
  (await getResourceContentsBySection(resourceStore.currentId!)) ||
    emptyContentBySection
)
const currentlyEditingContentId = ref<number | null>(null)

function nextOrder(list: { order?: number; [key: symbol]: any }[]) {
  if (list.length === 0) return 0
  return list.slice(-1)[0].order! + 1
}

const nextSectionOrder = computed<number>(() => {
  return nextOrder(contentsBySection.value)
})

function nextContentOrder(sectionIndex: number): number {
  return nextOrder(contentsBySection.value[sectionIndex].contents)
}

async function createSection(sectionTitle?: string) {
  const newSection = await addSection(
    resourceStore.currentId!,
    nextSectionOrder.value,
    sectionTitle
  )
  const length = contentsBySection.value.push(newSection!)
  return contentsBySection.value[length - 1]
}

async function createContent(
  payload: {
    type: string
    [key: string]: any
  },
  section: SectionWithContent,
  contentOrder = 0
) {
  if ("many" in payload) {
    return createContents(payload.many, section, contentOrder)
  }
  const content = await addContent(
    payload.type,
    contentOrder,
    resourceStore.currentId!,
    section!.id,
    payload
  )
  section!.contents.push(content!)
  currentlyEditingContentId.value = content.id!
  return content
}

async function createContents(
  payload: {
    type: string
    [key: string]: any
  },
  section: SectionWithContent,
  contentOrder = 0
) {
  const contents: Content[] = await addContents(
    contentOrder,
    resourceStore.currentId!,
    section!.id,
    payload
  )
  section!.contents.push(...contents!)
  if (contents.length === 1) {
    currentlyEditingContentId.value = contents[0].id!
  }

  return contents
}

async function newSoloContentInTheEnd(payload: {
  type: string
  [key: string]: any
}) {
  if (
    !contentsBySection.value.length ||
    contentsBySection.value.slice(-1)[0].isFoldable
  )
    return newContentInNewSection(payload)
  return newContentInSection({
    ...payload,
    sectionIndex: contentsBySection.value.length - 1,
  })
}

async function newContentInNewSection(payload: {
  type: string
  [key: string]: any
}) {
  const newSection = await createSection()
  return createContent(payload, newSection!)
}

async function newContentInSection(payload: {
  type: string
  sectionIndex: number
  [key: string]: any
}) {
  const sectionIndex = payload.sectionIndex
  return createContent(
    payload,
    contentsBySection.value[sectionIndex],
    nextContentOrder(sectionIndex)
  )
}

async function createAdHocSectionForContent({
  nextIndex,
}: {
  nextIndex: number
}) {
  const newSection = await addSection(
    resourceStore.currentId!,
    nextSectionOrder.value
  )
  let content: any = contentsBySection.value[nextIndex]

  content = await updateContent(
    {
      id: content!.id,
      section: newSection!.id,
    } as any as Content,
    false
  )
  newSection!.contents.push(content!)
  contentsBySection.value.splice(nextIndex, 1, newSection!)

  await updateSectionOrder(contentsBySection.value)

  const sectionToRemoveIndex = findSectionToDeleteIndex(
    content.section,
    contentsBySection.value
  )
  if (!(sectionToRemoveIndex === undefined))
    await onDeleteSection(sectionToRemoveIndex)
  return reloadContents()
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
  if (
    !contentsBySection.value[sectionIndex].isFoldable &&
    contentsBySection.value[sectionIndex].contents.length === 1
  )
    return onDeleteSection(sectionIndex)
  if (await deleteContent(id)) {
    contentsBySection.value[sectionIndex].contents.splice(contentIndex, 1)
    currentlyEditingContentId.value = null
  }
  // TODO display potential error
}

async function onDeleteSection(index: number, showSuccess = false) {
  const id = contentsBySection.value[index].id
  const success = await deleteSection(id)
  if (!success) return

  contentsBySection.value.splice(index, 1)
  await checkAndMerge(contentsBySection.value, index)
  reloadContents()
  if (success && showSuccess)
    useAlertStore().alert("La section a bien été supprimée")
}

async function reloadContents() {
  const reloadedContents = await getResourceContentsBySection(
    resourceStore.currentId!
  )
  if (!reloadedContents) return
  contentsBySection.value = reloadedContents
}
</script>

<style scoped lang="sass"></style>
