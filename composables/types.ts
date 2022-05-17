export type User = { id: number; email: string; username: string }

export type ExternalProducer = {
  name: string
  emailContact: string
  validated?: boolean
  resource?: number
  occupation?: number
}

export type Resource = {
  contents?: Content[]
  creator?: number
  id?: number
  internalProducerIds?: number[]
  isDraft?: boolean
  isShort?: boolean
  description?: string
  externalProducers?: ExternalProducer[]
  linkedResourceIds?: number[]
  producerState: string
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
  slug: string
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
  slug: string
  tags: Tag[]
}

export type Base = {
  id: number
  title: string
  owner: User
  isShort?: boolean
}

type BaseMiniContent = {
  type: string
  nbCol: number
  section: number
}

interface BaseContent extends BaseMiniContent {
  id?: number
  title?: string
  annotation?: string
  licence?: string
  order: number
}

export interface MiniLinkContent extends BaseMiniContent {
  link: string
}
export interface MiniTextContent extends BaseMiniContent {
  text: string
}
export type MiniFileContent = BaseMiniContent
export type MiniContent = MiniLinkContent | MiniTextContent | MiniFileContent

export interface LinkContent extends BaseContent {
  link: string
}
export interface TextContent extends BaseContent {
  text: string
}
export type FileContent = BaseContent
export type Content = LinkContent | TextContent | FileContent

export type ContentOrder = {
  [key: number]: { section: number; order: number }
}

export type Section = {
  id: number
  order: number
  isFoldable: boolean
  title?: string
}

export interface SectionWithContent extends Section {
  contents: Content[]
}
