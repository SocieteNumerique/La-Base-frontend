export type User = { id: number; email: string; username: string }

export type Resource = {
  contents: Content[]
  creator?: User
  id?: number
  internalProducerIds?: number[]
  isDraft?: boolean
  isShort?: boolean
  description?: string
  linkedResourceIds?: number[]
  rootBaseId?: number
  rootBase?: number
  tags?: TagCategory[]
  title: string
  url?: string
  zipCode?: number
}

export type TagCategory = {
  id: number
  name: string
  baseId?: number
}
export type Base = {
  id: number
  title: string
  owner: User
  isShort?: boolean
}

export type Content = {
  id?: number
  title?: string
  annotation?: string
  type: string
  licence?: string
  nbCol: number
}

export interface LinkContent extends Content {
  link: string
}

export interface TextContent extends Content {
  text: string
}

export type FileContent = Content
