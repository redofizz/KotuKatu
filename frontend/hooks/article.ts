import apiclient from "../apicient/apiclient"
import { parseCookies } from 'nookies';
import { NextPageContext } from 'next';

import { PostArticleParams,ArticleItemResponse } from "../types/articleitem"

// 記事投稿
export const PostArticle = (params: PostArticleParams, ctx?: NextPageContext) => {
  const Cookies = parseCookies(ctx);
  return apiclient.post("articles", params, { headers: {
    "access-token": Cookies._access_token,
    "client": Cookies._client,
    "uid": Cookies._uid
  }})
}

// 記事取得
export const GetArticle = (ctx?: NextPageContext) => {
  const Cookies = parseCookies(ctx);
  return apiclient.get<ArticleItemResponse>("articles", { headers: {
    "access-token": Cookies._access_token,
    "client": Cookies._client,
    "uid": Cookies._uid
  }})
}