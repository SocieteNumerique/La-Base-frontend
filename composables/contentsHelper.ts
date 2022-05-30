import {
  Content,
  Section,
  SectionWithContent,
  MiniContent,
  FullFile,
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

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export async function inputToFileObject(
  fileInput: HTMLInputElement
): Promise<FullFile | undefined> {
  const nbFiles = fileInput.files!.length
  if (!nbFiles) return
  if (nbFiles > 1) return /* TODO */
  const file = fileInput.files![0]
  const base64 = await fileToBase64(file)
  fileInput.files = null
  return { base64, name: file.name, type: file.type }
}

function getDefaultContent(type: string, sectionId: number): MiniContent {
  if (type === "text") return { type, text: "", nbCol: 3, section: sectionId }
  if (type === "file") return { type, nbCol: 1, section: sectionId }
  if (type === "link") return { type, link: "", nbCol: 1, section: sectionId }
  if (type === "linkedResource") return { type, nbCol: 1, section: sectionId }
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
  if (Object.hasOwn(content, "file") && !Object.hasOwn(content.file, "base64"))
    delete content?.file
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
  const { data, error } = await useApiPatch("contents/order/", order)
  if (!error.value) console.log(data)
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
