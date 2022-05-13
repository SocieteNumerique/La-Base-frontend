export type User = { id: number; email: string; username: string }

export type Resource = {
  contents?: Content[]
  creator?: User
  id?: number
  internalProducerIds?: number[]
  isDraft?: boolean
  isShort?: boolean
  description?: string
  linkedResourceIds?: number[]
  rootBaseId?: number
  rootBase?: number
  tags?: number[]
  title: string
  url?: string
  zipCode?: number
}

export type Tag = {
  category: number
  definition?: string
  id: number
  isDraft: boolean
  isFree: boolean
  name: string
}

export type TagCategory = {
  acceptsFreeTags: boolean
  baseId: number
  description: string
  id: number
  isDraft: boolean
  isMultiSelect: boolean
  maximumTagCount: number
  name: string
  relatesTo: string
  requiredToBePublic: boolean
  tags: number[]
}

export type TagCategoryWithFullTags = {
  acceptsFreeTags: boolean
  baseId: number
  description: string
  id: number
  isDraft: boolean
  isMultiSelect: boolean
  maximumTagCount: number
  name: string
  relatesTo: string
  requiredToBePublic: boolean
  tags: Tag[]
}

export type Base = {
  id: number
  title: string
  owner: User
  isShort?: boolean
}

export type BaseContent = {
  id?: number
  title?: string
  annotation?: string
  type: string
  licence?: string
  nbCol: number
  order?: number
}

export interface LinkContent extends BaseContent {
  link: string
}

export interface TextContent extends BaseContent {
  text: string
}

export type FileContent = BaseContent

export type Content = LinkContent | TextContent | FileContent
