import React, { useContext } from "react"

import { useRouter } from 'next/router';

import { destroyCookie } from 'nookies';
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"

import { Dialogcontext } from "../pages/_app"
import { AuthContext } from "../pages/_app"
import { signOut } from "../hooks/auth"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  iconButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textDecoration: "none",
    color: "inherit"
  },
  linkBtn: {
    textTransform: "none"
  }
}));

const Header = () => {
  const { loading, setLoading, isSignedIn, setIsSignedIn } = useContext(AuthContext)
  const { setIsDialog, setDialogMsg, setTitleDialog } = useContext(Dialogcontext)
  const classes = useStyles()
  const router = useRouter();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true)
    await signOut().then(response => {
      if (response.status === 200) {
        // サインアウト時には各Cookieを削除
        destroyCookie(null, '_access_token')
        destroyCookie(null, '_client')
        destroyCookie(null, '_uid')

        setIsSignedIn(false)

        router.push("/signin")
      } 
    }).catch(error => {
      setIsDialog(true)
      setTitleDialog("サインアウトエラー")
      setDialogMsg(error.response.data.errors.join(""))
    })
    setLoading(false)
  }

  const AuthButtons = () => {
    // 認証完了後はサインアウト用のボタンを表示
    // 未認証時は認証用のボタンを表示
    if (!loading) {
      if (isSignedIn) {
        return (
          <Button
            color="inherit"
            className={classes.linkBtn}
            onClick={handleSignOut}
          >
            SIGNOUT
          </Button>
        )
      } else {
        return (
          <>
            <Button
              href="/signin"
              color="inherit"
              className={classes.linkBtn}
            >
              SIGNIN
            </Button>
            <Button
              href="/signup"
              color="inherit"
              className={classes.linkBtn}
            >
              SIGNUP
            </Button>
          </>
        )
      }
    } else {
      return <></>
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            KotuKatu
          </Typography>
          <Button color="inherit" href="/">Home</Button>
          <AuthButtons />
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header