import apiclient from "../apicient/apiclient"
import { parseCookies } from 'nookies';
import { NextPageContext } from 'next';

import { SignUpParams, SignInParams, ResetPasswordParams, ChangePasswordParams } from "../types/authitem"

// サインアップ（新規アカウント作成）
export const signUp = (params: SignUpParams) => {
  return apiclient.post("auth", params)
}

// サインイン（ログイン）
export const signIn = (params: SignInParams)  => {
  return apiclient.post("auth/sign_in", params)
}

// サインアウト（ログアウト）
export const signOut = (ctx?: NextPageContext) => {
  const Cookies = parseCookies(ctx);
  return apiclient.delete("auth/sign_out", { headers: {
    "access-token": Cookies._access_token,
    "client": Cookies._client,
    "uid": Cookies._uid
  }})  
}

// パスワードリセット
export const resetPassword = (params: ResetPasswordParams) => {
  return apiclient.post("auth/password", params)
}

// パスワード変更
export const changePassword = (params: ChangePasswordParams) => {
  return apiclient.put("auth/password", params)
}

// 認証済みのユーザーを取得
export const getCurrentUser = (ctx?: NextPageContext) => {
  const Cookies = parseCookies(ctx);
  if (!Cookies._access_token || !Cookies._client || !Cookies._uid) return
  return apiclient.get("auth/validate_token", { headers: {
    "access-token": Cookies._access_token,
    "client": Cookies._client,
    "uid": Cookies._uid
  }})
}