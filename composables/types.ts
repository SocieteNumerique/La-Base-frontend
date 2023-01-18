import { Level } from "@tiptap/extension-heading"

export interface ObjectById<T> {
  [key: number]: T
}

export type User = {
  id?: number
  email: string
  isAdmin?: boolean
  isCnfs?: boolean
  isStaff?: boolean
  firstName: string
  lastName: string
  password?: string
  prefillEmail?: string
  showSignupModal?: boolean
  tags?: number[]
}

export type ExternalProducer = {
  name: string
  emailContact: string
  validated?: boolean
  resource?: number
  occupation?: number
  websiteUrl?: string
}

export type PinStatus = { id: number; isPinned: boolean }

export type Creator = {
  id: number
  firstName: string
  lastName: string
}

export type Resource = {
  accessRequiresUserAccount?: boolean
  authorizedUsers?: User[]
  authorizedUserTags?: number[]
  pinnedInBases?: number[]
  contents?: Content[]
  contributors?: User[]
  canWrite?: boolean
  contentStats?: { links: number; files: number }
  created?: string
  creator?: Creator
  creatorBases?: number[]
  dirty?: boolean
  hasGlobalLicense?: boolean
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
  licenseText?: LicenseText | null
  linkedResourceIds?: number[]
  modified: string
  profileImage?: ResizableImage
  producerState: string
  resourceCreatedOn: string
  rootBase?: number
  rootBaseTitle?: string
  state: string
  stats?: { publicPinCount: number; visitCount: number; pinCount: number }
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
  profileImage?: ResizableImage
}

export type CollectionWithDetailedResources = {
  id: number
  base: number
  description: string
  pinnedInBases?: number[]
  name: string
  nbResources?: number
  profileImage?: ResizableImage
  resources?: Resource[]
}

export type Collection = {
  id: number
  base: number
  description: string
  pinnedInBases?: number[]
  profileImage?: ResizableImage
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
  slug?: string
}

export type TagCategory = {
  acceptsFreeTags: boolean
  baseId: number
  description: string
  groupTagsByFamily: boolean
  id: number
  isDraft: boolean
  isMultiSelect: boolean
  maximumTagCount: number
  name: string
  radioDisplay: boolean
  relatesTo: string
  requiredToBePublic: boolean
  slug: string
  tags: number[]
}

export type TagCategoryWithFullTags = {
  acceptsFreeTags: boolean
  baseId: number
  description: string
  groupTagsByFamily: boolean
  id: number
  isDraft: boolean
  isMultiSelect: boolean
  maximumTagCount: number
  name: string
  radioDisplay: boolean
  relatesTo: string
  requiredToBePublic: boolean
  slug: string
  tags: Tag[]
}

export enum BaseSectionType {
  RESOURCES = "resources",
  COLLECTIONS = "collections",
}
export type BaseSection = {
  id?: number
  base: number
  title: string
  description: string
  position?: number
  type: BaseSectionType
  resources: number[]
  collections: number[]
}

export type BaseCreate = {
  contact?: string
  coverImage?: ResizableImage
  description?: string
  profileImage?: ResizableImage
  tags?: number[]
  title: string
}
type BaseStats = {
  bookmarkedCount: number
  resourceCount: number
  visitCount: number
}
export type Base = {
  admins?: User[]
  authorizedUsers?: User[]
  authorizedUserTags?: number[]
  bookmarked: boolean
  canAddResources?: boolean
  canWrite?: boolean
  collections?: number[]
  contact?: string
  contactState?: string
  contributors?: User[]
  contributorTags?: number[]
  coverImage?: ResizableImage
  description?: string
  profileImage?: ResizableImage
  id: number
  isCertified?: boolean
  isShort?: boolean
  nationalCartographyWebsite?: string
  owner: User | number
  participantTypeTags?: number[]
  resourceChoices?: Resource[]
  collectionChoices?: Collection[]
  resources?: ResourcesWithPagination
  socialMediaFacebook?: string
  socialMediaLinkedin?: string
  socialMediaMastodon?: string
  socialMediaTwitter?: string
  state?: string
  stats?: BaseStats
  tags?: number[]
  territoryTags?: number[]
  title: string
  website?: string
  showLatestAdditions?: boolean
  latestAdditions?: number[]
  sections?: number[]
  resources_sections?: Resource[]
}
export type ResourcesWithPagination = {
  count: number
  pageCount: number
  results: Resource[]
}
export type BaseWithDetailedResources = {
  bookmarked: boolean
  id: number
  isShort?: boolean
  owner: User | number
  resources?: ResourcesWithPagination
  title: string
  collections: CollectionWithDetailedResources[]
  sections?: BaseSection[]
  resourcesInPinnedCollections?: Resource[]
  latestAdditions?: Resource[]
  sectionResources?: Resource[]
}

type BaseContent = {
  annotation?: string
  id?: number
  licenseText?: LicenseText | null
  licenseKnowledge?: LicenseKnowledge
  nbCol: number
  order?: number
  section: number
  resource?: number
  // for now content tags ar only for license.
  // If that changes, the license modals need to be updated
  tags?: number[]
  licenseTags?: number[]
  accessPriceTags?: number[]
  title?: string
  type: string
  useResourceLicenseAndAccess?: boolean
}

export interface LinkContent extends BaseContent {
  link: string
  targetDescription?: string
  targetImage?: string
  targetTitle?: string
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

export type CroppedImage = {
  base64?: string
  name: string
  mimeType?: string
  links?: { [key: string]: string }
}

export type ResizableImage = {
  image?: FullFile
  croppedImage?: CroppedImage
  relativeHeight?: number
  relativeWidth?: number
  relativeLeft?: number
  relativeTop?: number
}

export interface FileContent extends BaseContent {
  imageAlt?: string
  file?: FullFile
  withPreview?: boolean
}

export type Content =
  | FileContent
  | LinkContent
  | TextContent
  | LinkedResourceContent

export type LicenseText = {
  name?: string
  file?: FullFile
  link?: string
}
export type LicenseKnowledge = "specific" | "resource" | "unknown"

export type ContentOrder = {
  [key: number]: { section: number; order: number }
}

export type Section = {
  id: number
  isNew?: boolean
  isFoldable: boolean
  order: number
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

export type SearchResultResults<ResultType> = {
  objects: ResultType[]
  possibleTags: number[]
  dataType: string
  text: string
}
export type GenericSearchResultResults = {
  objects: Base[] | Resource[]
  possibleTags: number[]
  dataType: string
  text: string
}
export type SearchResult<ResultType> = {
  count: number
  results: SearchResultResults<ResultType>
}
export type GenericSearchResult = {
  count: number
  results: GenericSearchResultResults
}
export type UsersSearchResult = SearchResult<User>
export type BasesSearchResult = SearchResult<Base>
export type ResourcesSearchResult = SearchResult<Resource>

export type Page = {
  htmlContent?: string
  description: string
  icon: string
  isShort: string
  order: number
  showInMenu: boolean
  slug: string
  title: string
}

export enum Heading {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
}
export enum OtherRichTextActions {
  BOLD = "bold",
  ITALIC = "italic",
  LIST_ORDERED = "list-ordered",
  LIST_UNORDERED = "list-unordered",
  LINK = "link",
  LINK_UNLINK = "link",
}
type RichTextToolbarActions = Heading | OtherRichTextActions
export type RichTextToolbarHeadingSwitch = {
  [key in Heading]?: Level
}
export type RichTextToolbarOptions = {
  show?: RichTextToolbarActions[]
  headingSwitch?: RichTextToolbarHeadingSwitch
}
export type RichTextToolbarItem = {
  name: RichTextToolbarActions
  testActive: () => boolean
  onClick: () => void
  icon: string
  disabled: () => boolean
}
export type RichTextToolbar = RichTextToolbarItem[]

export type UserSearchQuery = {
  orderBy: string
  tagOperator: "OR" | "AND"
  text: string
  tags: number[]
}
export type UserSearch = {
  dataType: "resources" | "bases"
  id: number
  name: string
  query: UserSearchQuery
}
