export type User = { id: number; email: string; username: string }

export type ExternalProducer = {
  name: string
  emailContact: string
  validated?: boolean
  resource?: number
  occupation?: number
}

export type Resource = {
  accessRequiresUserAccount?: boolean
  contents?: Content[]
  created?: string
  creator?: number
  id: number
  internalProducerIds?: number[]
  isDraft?: boolean
  isLinkedToATerritory?: boolean
  isShort?: boolean
  description?: string
  externalProducers?: ExternalProducer[]
  linkedResourceIds?: number[]
  modified: string
  producerState: string
  rootBaseId?: number
  rootBase?: number
  status: string
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
  isShort?: boolean
  owner: number
  resources?: number[]
  title: string
}
export type BaseWithDetailedResources = {
  id: number
  isShort?: boolean
  owner: number
  resources?: Resource[]
  title: string
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
export interface MiniLinkedResourceContent extends BaseContent {
  linkedResource: number
}
export type MiniFileContent = BaseMiniContent
export type MiniContent = MiniLinkContent | MiniTextContent | MiniFileContent

export interface LinkContent extends BaseContent {
  link: string
  withPreview?: boolean
}
export interface TextContent extends BaseContent {
  text: string
}
export interface LinkedResourceContent extends BaseContent {
  linkedResource: number
}

export type FullFile = {
  base64?: string
  name: string
  type?: string
  link?: string
}

export interface FileContent extends BaseContent {
  file: string | FullFile
  withPreview?: boolean
}
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

export type SubMenu = {
  description: string
  disabled?: boolean
  key: string
  name: string
}
export type SubMenuByKey = {
  [key: string]: SubMenu
}

export type Menu = {
  key: string
  name: string
  subMenus: SubMenu[]
}

export type MenuWithSubMenusByKey = {
  key: string
  name: string
  subMenus: SubMenuByKey
}

export type MenuByKey = {
  [key: string]: MenuWithSubMenusByKey
}
