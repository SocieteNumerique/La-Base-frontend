import {
  Content,
  FileContent,
  LinkedResourceContent,
  Section,
  SectionWithContent,
} from "~/composables/types"
import {
  useApiDelete,
  useApiGet,
  useApiPatch,
  useApiPost,
} from "~/composables/api"

export async function getResourceContentsBySection(resourceId: number) {
  const { data, error } = await useApiGet<{
    sections: SectionWithContent[]
  }>(`resources/${resourceId}/contents/`)
  if (!error.value) {
    return data.value.sections
  }
}

function getDefaultContent(type: string, sectionId: number): Content {
  if (type === "text") return { type, text: "", nbCol: 3, section: sectionId }
  if (type === "file") return { type, nbCol: 2, section: sectionId }
  if (type === "link") return { type, link: "", nbCol: 2, section: sectionId }
  if (type === "linkedResource") return { type, nbCol: 2, section: sectionId }
  throw "unknown type"
}

async function createContent(resourceId: number, content: Content) {
  const { data, error } = await useApiPost<Content>(`contents/`, {
    ...content,
    resource: resourceId,
  })
  if (!error.value) {
    return data.value
  }
}

export async function updateContent(
  content: Content,
  showSuccess = true
): Promise<Content | undefined> {
  const { data, error } = await useApiPatch<Content>(
    `contents/${content.id}/`,
    content,
    undefined,
    showSuccess ? "Mise à jour réussie du contenu" : null,
    true
  )
  if (!error.value) {
    return data.value
  }
}

export async function addContent(
  type: string,
  order: number,
  resourceId: number,
  sectionId: number,
  payload: any = null
): Promise<Content> {
  const content = getDefaultContent(type, sectionId)
  if (type === "file") (content as FileContent).file = payload.file
  if (type === "linkedResource")
    (content as LinkedResourceContent).linkedResource = resourceId
  const createdContent = await createContent(resourceId, { ...content, order })
  if (createdContent) return createdContent
  throw "error at creating Content"
}

export async function deleteContent(id: number, showSuccess = false) {
  const { error } = await useApiDelete(
    `contents/${id}/`,
    {},
    showSuccess ? "Le contenu a bien été supprimé" : null,
    true
  )
  if (!error.value) {
    return true
  }
}

export async function checkAndMerge(
  sections: SectionWithContent[],
  indexMoved: number
) {
  const sectionsToConsider = []
  if (sections[indexMoved - 1] && !sections[indexMoved - 1].isFoldable)
    sectionsToConsider.push(indexMoved - 1)

  if (sections[indexMoved] && !sections[indexMoved].isFoldable)
    sectionsToConsider.push(indexMoved)
  else return

  if (sections[indexMoved + 1] && !sections[indexMoved + 1].isFoldable)
    sectionsToConsider.push(indexMoved + 1)

  if (sectionsToConsider.length < 2) return true

  const mergedContents = []
  for (const sectionIndex of sectionsToConsider)
    mergedContents.push(...sections[sectionIndex].contents)
  const sectionContainerIndex = sectionsToConsider.splice(0, 1)[0]
  const sectionContainer = sections[sectionContainerIndex]
  const success = await updateContentOrder(mergedContents, sectionContainer.id)
  if (!success) return false

  return (
    await Promise.all(
      sectionsToConsider
        .map((toDeleteSectionIndex) => sections[toDeleteSectionIndex].id)
        .map(async (toDeleteSectionId) => deleteSection(toDeleteSectionId))
    )
  ).every((deletionSuccess: boolean) => deletionSuccess)
}

export function findSectionToDeleteIndex(
  sectionId: number,
  sections: SectionWithContent[]
): number | undefined {
  console.log({ sectionId })
  const oldSectionIndex = sections.findIndex(
    (sectionToTest) => sectionToTest.id === sectionId
  )
  const oldSection = sections[oldSectionIndex]
  if (!oldSection?.isFoldable && oldSection?.contents.length === 0)
    return oldSectionIndex
}

export function orderSwap(list: any[], index: number, direction: number) {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= list.length) return

  const tempInstance = list[index]
  list[index] = list[nextIndex]!
  list[nextIndex] = tempInstance!
}

export async function updateContentOrder(
  contents: Content[],
  sectionId: number
) {
  // to respect unique_together in database while reordering is always managed sequentially
  const millis = Date.now()
  // transform Content[] to { contentId: { section, order } }
  const order: any = {}
  contents.forEach((content, index) => {
    order[content.id!] = { order: index + millis, section: sectionId }
    contents[index].order = index + millis
  })
  const { error } = await useApiPatch("contents/order/", order)
  return !error.value
}

// --------------- Sections ---------------------

export async function updateSectionOrder(sections: SectionWithContent[]) {
  // to respect unique_together in database while reordering is always managed sequentially
  const millis = Date.now()
  // transform Section[] to { sectionId: { order } }
  const order: any = {}
  sections.forEach((section, index) => {
    order[section.id!] = { order: index + millis }
    sections[index].order = index + millis
  })
  const { error } = await useApiPatch("sections/order/", order)
  return !error.value
}

export async function addSection(
  resourceId: number,
  order: number,
  sectionTitle?: string
): Promise<SectionWithContent | undefined> {
  const section: any = {
    resource: resourceId,
    order,
  }
  if (sectionTitle) {
    section.title = sectionTitle
    section.isFoldable = true
  }
  const { data, error } = await useApiPost<Section>("sections/", section)
  if (!error.value) {
    return { ...data.value, contents: [] }
  }
}

export async function updateSection(section: Section) {
  const { data, error } = await useApiPatch<Section>(
    `sections/${section.id}/`,
    section,
    undefined,
    { title: "Mise à jour de la section réussie" },
    true
  )
  if (!error.value) {
    return data.value
  }
}

export async function deleteSection(
  id: number,
  showSuccess = false
): Promise<boolean> {
  const { error } = await useApiDelete(
    `sections/${id}/`,
    {},
    showSuccess ? "La section a bien été supprimée" : null,
    true
  )
  if (!error.value) {
    return true
  }
  return false
}

export const emptyContentBySection: SectionWithContent[] = []
