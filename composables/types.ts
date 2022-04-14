export type User = { id: number, email: string, username: string }
export type Resource = { id: number, title: string, content: string, author: User }
export type Category = { id: number, title: string, base: number, resources: Resource[] }
export type Base = { id: number, title: string, owner: User, categories: Category[], isShort?: boolean }
