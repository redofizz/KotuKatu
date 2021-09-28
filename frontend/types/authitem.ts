// サインアップ
export interface SignUpParams {
  name: string
  nickname: string
  email: string
  password: string
  passwordConfirmation: string
  confirm_success_url: string
}

// サインイン
export interface SignInParams {
  email: string
  password: string
}

// リセットパスワード
export interface ResetPasswordParams {
  email: string
  redirect_url: string
}

// リセットパスワード変更
export interface ChangePasswordParams {
  password: string
  password_confirmation: string
  reset_password_token: string
}

// 認証済みパスワード変更
export interface AuthChangePasswordParams {
  password: string
  password_confirmation: string
}

// プロフィールを編集
export interface EditProfileParams {
  email: string
  name: string
  nickname: string
}

// ユーザー
export interface User {
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