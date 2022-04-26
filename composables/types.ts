export type User = { id: number, email: string, username: string }

export type Resource = {
  id: number,
  title: string,
  content: string,
  creator: User,
  root_base_id: number,
  is_draft: boolean,
  description: string,
  zip_code?: number,
  url?: string,
  linked_resource_ids?: number[],
  internal_producer_ids?: number[],
  tags?: TagCategory[]
}

export type TagCategory = {
  id: number,
  name: string,
  base_id?: number,
}
export type Base = {
  id: number,
  title: string,
  owner: User,
  isShort?: boolean
}


export type Content = {
  id?: number
  title?: string,
  annotation?: string,
  type: string,
  licence?: string,
  nbCol: number
}

export interface LinkContent extends Content {
  link: string
}

export interface TextContent extends Content {
  text: string
}

export interface FileContent extends Content { }
