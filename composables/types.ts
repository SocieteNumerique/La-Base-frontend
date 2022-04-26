export type User = { id: number; email: string; username: string }

export type Resource = {
  id?: number
  title: string
  content: string
  creator?: User
  rootBaseId?: number
  isDraft?: boolean
  description?: string
  zipCode?: number
  url?: string
  linkedResourceIds?: number[]
  internalProducerIds?: number[]
  tags?: TagCategory[]
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

export interface FileContent extends Content {}
