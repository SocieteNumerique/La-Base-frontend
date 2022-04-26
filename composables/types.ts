export type User = { id: number; email: string; username: string }
export type Resource = {
  author: User | null
  baseId: number | null
  content: string
  id: number | null
  title: string
}
export type Category = {
  id: number
  title: string
  base: number
  resources: Resource[]
}
export type Base = {
  id: number
  title: string
  owner: User
  categories: Category[]
  isShort?: boolean
}
