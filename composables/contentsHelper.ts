import { Content } from "~/composables/types"
import { useApiGet, useApiPatch, useApiPost, useApiDelete } from "~/composables/api"

export async function getResourceContents(resourceId: number) {
  const { data, error } = await useApiGet<Content[]>(
    `resources/${resourceId}/contents/`
  )
  if (!error.value) {
    return data.value
  }
}

function getDefaultContent(type: string): Content {
  if (type === "text") return { type: "text", text: "", nbCol: 3 }
  if (type === "file") return { type: "file", nbCol: 1 }
  if (type === "link") return { type: "link", link: "", nbCol: 1 }
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
  resourceId: number
): Promise<Content> {
  const content = getDefaultContent(type)
  content.order = order
  const createdContent = await createContent(resourceId, content)
  if (createdContent) return createdContent
  throw "error at creating Content"
}

export async function deleteContent(id: number) {
  const { data, error } = await useApiDelete<Content>(`contents/${id}/`)
  if (!error.value) {
    return data.value
  }
}
