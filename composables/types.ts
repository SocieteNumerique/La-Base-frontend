import { Coordinates } from "vue-advanced-cropper"

export type User = {
  id?: number
  email: string
  isAdmin?: boolean
  isCnfs?: boolean
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
  authorizedUsers?: User[]
  authorizedUserTags?: number[]
  pinnedInBases?: number[]
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
  supportTags?: number[]
  tags?: number[]
  title: string
  url?: string
  zipCode?: number
}

export type ResourceCreate = {
  rootBase: number
  title: string
}

export type CollectionCreate = {
  base: number
  name: string
}

export type Collection = {
  id: number
  base: number
  pinnedInBases?: number[]
  name: string
  nbResources?: number
  resources?: number[]
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
export type BaseCreate = {
  contact?: string
  description?: string
  profileImage?: ResizableImage
  tags?: number[]
  title: string
}
export type Base = {
  admins?: User[]
  authorizedUsers?: User[]
  authorizedUserTags?: number[]
  canAddResources?: boolean
  canWrite?: boolean
  collections?: number[]
  contact?: string
  contributors?: User[]
  contributorTags?: number[]
  description?: string
  profileImage?: ResizableImage
  id: number
  isShort?: boolean
  owner: User | number
  participantTypeTags?: number[]
  resources?: number[]
  state?: string
  tags?: number[]
  territoryTags?: number[]
  title: string
}
export type BaseWithDetailedResources = {
  id: number
  isShort?: boolean
  owner: User | number
  resources?: Resource[]
  title: string
  collections: Collection[]
  resourcesInPinnedCollections?: Resource[]
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

export type ResizableImage = {
  image?: FullFile
  scaleX?: number
  scaleY?: number
  relativePositionY?: number
  relativePositionX?: number
  coordinates?: Coordinates
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
