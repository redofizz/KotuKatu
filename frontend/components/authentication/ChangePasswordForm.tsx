import React, { useState, useContext } from "react"

import { useRouter } from 'next/router';
import Link from 'next/link';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { makeStyles } from '@mui/styles';
import theme from '../../pages/theme';

import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';


import { Dialogcontext, AuthContext } from "../../pages/_app"
import { changePassword } from "../../hooks/auth"
import { ChangePasswordParams } from "../../types/authitem"

import queryString from "query-string";

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
    marginTop: theme.spacing(3),
  },
  authsocial: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ChangePasswordForm() {
  const classes = useStyles();
  const router = useRouter();
  const [password, setPassword] = useState<string>("")
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const { setLoading } = useContext(AuthContext)
  const { setIsDialog, setDialogMsg, setTitleDialog } = useContext(Dialogcontext)
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleShowPasswordConfirmation = () => {
    setShowPasswordConfirmation((show) => !show);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    setLoading(true)
    router.query = queryString.parse(router.asPath.split(/\?/)[1]) as { [key: string]: string };

    const reset_password_token : string = router.query.reset_password_token == undefined ? "" : router.query.reset_password_token?.toString()
    const params: ChangePasswordParams = {
      password: password,
      password_confirmation: passwordConfirmation,
      reset_password_token: reset_password_token
    }

    await changePassword(params).then(response => {
      if (response.status === 200) {
        // 成功の場合はメール確認に入る
        // ダイアログを出す
        //　登録に成功しました。
        setIsDialog(true)
        setTitleDialog("パスワード変更")
        setDialogMsg("パスワード変更を完了しました。")
        router.push("/signin")
      } 
    }).catch(error => {
      setIsDialog(true)
      setTitleDialog("パスワード変更エラー")
      setDialogMsg(error.response.data.errors.full_messages.join(""))
    })

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
          Change Pasword
        </Typography>

        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="パスワード"
                type={showPassword ? 'text' : 'password'}
                id="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                value={password}
                autoComplete="current-password"
                onChange={event => setPassword(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="パスワード(確認)"
                type={showPasswordConfirmation ? 'text' : 'password'}
                id="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPasswordConfirmation} edge="end">
                        <Icon icon={showPasswordConfirmation ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                value={passwordConfirmation}
                autoComplete="current-password"
                onChange={event => setPasswordConfirmation(event.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            パスワードを変更
          </Button>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}