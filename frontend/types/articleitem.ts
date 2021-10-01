// 記事投稿
export interface PostArticleParams {
  title: string
  body: string
}

export interface ArticleItemResponse {
  success: boolean
  message: string
  data:[{
    id: number
    title: string
    body: string
    user_id: number
    created_at: Date
    updated_at: Date
    user:{
      id: number
      uid: string
      provider: string
      email: string
      name: string
      nickname?: string
      image?: string
      allowPasswordChange: boolean
      created_at: Date
      updated_at: Date
    }
  }]
}

export type ArticleItem = {
  id: number
  title: string
  body: string
  user_id: number
  created_at: Date
  updated_at: Date
  user:{
    id: number
    uid: string
    provider: string
    email: string
    name: string
    nickname?: string
    image?: string
    allowPasswordChange: boolean
    created_at: Date
    updated_at: Date
  }
}