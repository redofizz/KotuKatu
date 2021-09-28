import { useState, useContext } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import theme from '../../pages/theme';

import Container from '@mui/material/Container';


import { Dialogcontext, AuthContext } from "../../pages/_app"
import { resetPassword } from "../../hooks/auth"
import { ResetPasswordParams } from "../../types/authitem"

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link href="https://material-ui.com/">
        <Button color="inherit">
          Your Website
        </Button>
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(() => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ForgotPassword() {
  const classes = useStyles();
  const router = useRouter();
  const [email, setEmail] = useState<string>("")
  const { setLoading } = useContext(AuthContext)
  const { setIsDialog, setDialogMsg ,setTitleDialog} = useContext(Dialogcontext)
  const registerUser = async (event: any) => {
    event.preventDefault()
    setLoading(true)
    const params: ResetPasswordParams = {
      email: email,
      redirect_url: process.env.NEXT_PUBLIC_FRONTENDBASEURL + "changepass" ?? "http://localhost:3000/" + "changepass"
    }

    await resetPassword(params).then(response => {
      if (response.status === 200) {
        // 成功の場合はメール確認に入る
        // ダイアログを出す
        //　登録に成功しました。
        setIsDialog(true)
        setTitleDialog("リセットパスワード")
        setDialogMsg("パスワードメールを送信しました。")
        router.push("/")
      } 
    }).catch(error => {
      setIsDialog(true)
      setTitleDialog("リセットパスワードエラー")
      setDialogMsg(error.response.data.errors.join(""))
    })

    try {
      const res = await resetPassword(params)
      if (res.status === 200) {

        router.push("/")
      } else {
        router.push("/signin")
      }
    } catch (err) {
      router.push("/signin")
    }
    
    setLoading(false)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          FORGOT YOUR PASSWORD?
        </Typography>

        <form className={classes.form} onSubmit={registerUser} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            リセットメール送信
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signin">
                サインイン
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}