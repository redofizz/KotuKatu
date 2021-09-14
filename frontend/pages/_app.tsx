import React, { useState, useEffect, createContext }  from 'react'

import { NextPageContext } from 'next';
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router';

import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/core/styles'

import theme from './theme'

import { getCurrentUser } from "../hooks/auth"
import { User } from "../types/authitem"

import { setCookie } from 'nookies';

import queryString from "query-string";

// グローバルで扱う変数・関数
export const AuthContext = createContext({} as {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
})

const MyApp = ({ Component, pageProps }: AppProps, ctx: NextPageContext) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>()

  // 認証済みのユーザーがいるかどうかチェック
  // 確認できた場合はそのユーザーの情報を取得
  const handleGetCurrentUser = async () => {
    router.query = queryString.parse(router.asPath.split(/\?/)[1]) as { [key: string]: string };
    if(router.query.auth_token != undefined){
      const auth_token : string = router.query.auth_token == undefined ? "" : router.query.auth_token?.toString()
      const client_id : string = router.query.client_id == undefined ? "" : router.query.client_id?.toString()
      const uid : string = router.query.uid == undefined ? "" : router.query.uid?.toString()
      setCookie(null, '_access_token', auth_token, {
        maxAge: 30 * 24 * 60 * 60, // お好きな期限を
        path: '/',
      });
      setCookie(null, '_client', client_id, {
        maxAge: 30 * 24 * 60 * 60, // お好きな期限を
        path: '/',
      });
  
      setCookie(null, '_uid', uid, {
        maxAge: 30 * 24 * 60 * 60, // お好きな期限を
        path: '/',
      });
    }

    try {
      const res = await getCurrentUser()
      if (res?.data.is_login === true) {
        setIsSignedIn(true)
        setCurrentUser(res?.data.data)
      } else {
        console.log("No current user")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }



  // 第二引数に空配列を指定してマウント・アンマウント毎（CSRでの各画面遷移時）に呼ばれるようにする
  useEffect(() => {
    // CSR用認証チェック
    const jssStyles = document.querySelector('#jss-server-side')
    jssStyles?.parentElement?.removeChild(jssStyles)

    handleGetCurrentUser()

    router.beforePopState(({ url, as, options }) => {
      // ログイン画面とエラー画面遷移時のみ認証チェックを行わない
      if (url !== '/signin' && url !== '/_error' && url !== '/signup') {
        if (!loading) {
          if (isSignedIn) {
            return false;
          } else {
            window.location.href = '/signin';
          }
        } else {
          return true;
        }
        return false;
      }
      return true;
    });
  }, [setCurrentUser]);

  const component =
    typeof pageProps === 'undefined' ? null : (
      <>
        <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser}}>
          <Head>
            <title>KotuKatu</title>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </AuthContext.Provider>
      </>
    );

  return component;
};

export default MyApp;