import {
  Content,
  MiniContent,
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

function getDefaultContent(type: string, sectionId: number): MiniContent {
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
  content: Content
): Promise<Content | undefined> {
  if (
    Object.hasOwn(content, "file") &&
    // @ts-ignore
    !Object.hasOwn(content.file, "base64")
  ) {
    // @ts-ignore
    delete content?.file
  }

  const { data, error } = await useApiPatch<Content>(
    `contents/${content.id}/`,
    content
  )
  if (!error.value) {
    // @ts-ignore
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
  if (type === "file") content.file = payload.file
  if (type === "linkedResource") content.linkedResource = resourceId
  const createdContent = await createContent(resourceId, { ...content, order })
  if (createdContent) return createdContent
  throw "error at creating Content"
}

export async function deleteContent(id: number) {
  const { error } = await useApiDelete(`contents/${id}/`)
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

  if (sectionsToConsider.length < 2) return

  const mergedContents = []
  for (const sectionIndex of sectionsToConsider)
    mergedContents.push(...sections[sectionIndex].contents)
  const sectionContainerIndex = sectionsToConsider.splice(0, 1)[0]
  const sectionContainerId = sections[sectionContainerIndex].id
  console.log({ mergedContents, sectionContainerId })
  const success = await updateContentOrder(mergedContents, sectionContainerId)
  if (!success) return

  await Promise.all(
    sectionsToConsider
      .map((toDeleteSectionIndex) => sections[toDeleteSectionIndex].id)
      .map(async (toDeleteSectionId) => deleteSection(toDeleteSectionId))
  )
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
    section
  )
  if (!error.value) {
    return data.value
  }
}

export async function deleteSection(id: number) {
  const { error } = await useApiDelete(`sections/${id}/`)
  if (!error.value) {
    return true
  }
}

export const emptyContentBySection: SectionWithContent[] = []
