export type User = {
  id?: number
  email: string
  isAdmin?: boolean
  firstName: string
  lastName: string
  password?: string
  tags?: number[]
}

export type ExternalProducer = {
  name: string
  emailContact: string
  validated?: boolean
  resource?: number
  occupation?: number
}

export type PinStatus = { id: number; isPinned: boolean }

export type Resource = {
  accessRequiresUserAccount?: boolean
  basesPinnedIn?: PinStatus[]
  contents?: Content[]
  canWrite?: boolean
  coverImage?: FullFile
  contentStats?: { links: number; files: number }
  created?: string
  creator?: number
  dirty?: boolean
  id: number
  internalProducerIds?: number[]
  isDraft?: boolean
  isGridViewEnabled?: boolean
  isLabeled?: boolean
  isLinkedToATerritory?: boolean
  isShort?: boolean
  description?: string
  externalProducers?: ExternalProducer[]
  labelDetails?: string
  labelState: string
  linkedResourceIds?: number[]
  modified: string
  producerState: string
  resourceCreatedOn: string
  rootBase?: number
  rootBaseTitle?: string
  state: string
  stats?: { pinned: number; views: number }
  supports?: string[]
  tags?: number[]
  title: string
  url?: string
  zipCode?: number
}

export type ResourceCreate = {
  rootBase: number
  title: string
}

export type Tag = {
  category: number
  count?: number
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
  canWrite?: boolean
  id: number
  isShort?: boolean
  owner: User
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

type BaseContent = {
  annotation?: string
  id?: number
  licence?: string
  nbCol: number
  order?: number
  section: number
  title?: string
  type: string
}

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
  mimeType?: string
  link?: string
}

export interface FileContent extends BaseContent {
  file?: FullFile
  withPreview?: boolean
}

export type Content =
  | FileContent
  | LinkContent
  | TextContent
  | LinkedResourceContent

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
  description?: string
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

export type Alert = {
  id?: string
  title: string
  text?: string
  type?: string
}

type SearchResultResults<ResultType> = {
  objects: ResultType[]
  possibleTags: number[]
  dataType: string
  text: string
}
type SearchResult<ResultType> = {
  count: number
  results: SearchResultResults<ResultType>
}
export type UsersSearchResult = SearchResult<User>
export type BasesSearchResult = SearchResult<Base>
export type ResourcesSearchResult = SearchResult<Resource>
