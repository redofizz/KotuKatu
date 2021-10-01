import React, { useState, useEffect, useContext, createContext, Dispatch, SetStateAction }  from 'react'

import { NextPageContext } from 'next';
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router';

import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';

import theme from './theme'

import { getCurrentUser } from "../hooks/auth"
import { User } from "../types/authitem"

import { setCookie } from 'nookies';

import queryString from "query-string";

// グローバルで扱う変数・関数
export const AuthContext = createContext({} as {
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: Dispatch<SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: Dispatch<SetStateAction<User | undefined>>
})

// グローバルで扱う変数・関数
export const Dialogcontext = createContext({} as {
  isDialog: boolean
  setIsDialog: Dispatch<SetStateAction<boolean>>
  DialogMsg: string
  setDialogMsg: Dispatch<SetStateAction<string>>
  TitleDialog: string
  setTitleDialog: Dispatch<SetStateAction<string>>
})

const useStyles = makeStyles(() => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))


const MyApp = ({ Component, pageProps }: AppProps, ctx: NextPageContext) => {
  const classes = useStyles();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>()
  const [isDialog, setIsDialog] = useState<boolean>(false)
  const [DialogMsg, setDialogMsg] = useState<string>("")
  const [TitleDialog, setTitleDialog] = useState<string>("")

  const handleDialogClose = () => {
    setIsDialog(false)
    setDialogMsg("")
  };

  // 認証済みのユーザーがいるかどうかチェック
  // 確認できた場合はそのユーザーの情報を取得
  const handleGetCurrentUser = async () => {
    setLoading(true)
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

    if(router.query.account_confirmation_success){
      setIsDialog(true)
      setTitleDialog("メールアドレス確認")
      setDialogMsg("メールアドレス確認に成功しました。")
    }

    try {
      const res = await getCurrentUser()
      if (res?.data.success) {
        setCookie(null, '_access_token', res.headers["access-token"], {
          maxAge: 30 * 24 * 60 * 60, // お好きな期限を
          path: '/',
        });
        setCookie(null, '_client', res.headers["client"], {
          maxAge: 30 * 24 * 60 * 60, // お好きな期限を
          path: '/',
        });
    
        setCookie(null, '_uid', res.headers["uid"], {
          maxAge: 30 * 24 * 60 * 60, // お好きな期限を
          path: '/',
        });
        setIsSignedIn(true)
        setCurrentUser(res?.data.data)
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
          <Dialogcontext.Provider value={{ isDialog, setIsDialog, DialogMsg, setDialogMsg, TitleDialog, setTitleDialog }}>
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

              <Dialog
                open={isDialog}
                onClose={handleDialogClose}
              >
                <DialogTitle id="alert-dialog-title">
                  {TitleDialog}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {DialogMsg}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDialogClose} autoFocus>
                    OK
                  </Button>
                </DialogActions>
              </Dialog>

              <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
              </Backdrop>

            </ThemeProvider>
          </Dialogcontext.Provider>
        </AuthContext.Provider>
      </>
    );

  return component;
};

export default MyApp;