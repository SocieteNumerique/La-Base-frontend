import {
  Content,
  Section,
  ContentOrder,
  SectionWithContent,
  MiniContent,
} from "~/composables/types"
import {
  useApiGet,
  useApiPatch,
  useApiPost,
  useApiDelete,
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
  if (type === "text")
    return { type: "text", text: "", nbCol: 3, section: sectionId }
  if (type === "file") return { type: "file", nbCol: 1, section: sectionId }
  if (type === "link")
    return { type: "link", link: "", nbCol: 1, section: sectionId }
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

export async function updateContent(content: Content) {
  const { data, error } = await useApiPatch<Content>(
    `contents/${content.id}/`,
    content
  )
  if (!error.value) {
    return data.value
  }
}

export async function addContent(
  type: string,
  order: number,
  resourceId: number,
  sectionId: number
): Promise<Content> {
  const content = getDefaultContent(type, sectionId)
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
  const order = contents.reduce(
    (
      prev: { [key: number]: { section: number; order: number } },
      content: Content,
      index
    ) => {
      prev[content.id!] = {
        order: index + millis,
        section: sectionId,
      }
      return prev
    },
    {}
  )
  const { data, error } = await useApiPatch("contents/order/", order)
  if (!error.value) console.log(data)
}

export async function updateSectionOrder(sections: SectionWithContent[]) {
  // to respect unique_together in database while reordering is always managed sequentially
  const millis = Date.now()
  // transform Section[] to { sectionId: { order } }
  const order = sections.reduce(
    (
      prev: { [key: number]: { order: number } },
      section: SectionWithContent,
      index
    ) => {
      prev[section.id!] = {
        order: index + millis,
      }
      return prev
    },
    {}
  )
  const { data, error } = await useApiPatch("sections/order/", order)
  if (!error.value) console.log(data)
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

export async function deleteSection(id: number) {
  const { error } = await useApiDelete(`sections/${id}/`)
  if (!error.value) {
    return true
  }
}

export const emptyContentBySection: SectionWithContent[] = []
