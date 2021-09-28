import React, { useState, useContext, useEffect } from "react"

import Link from 'next/link';
import { useRouter } from 'next/router';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';

import theme from '../../pages/theme'

import { AuthContext } from "../../pages/_app"
import { Dialogcontext } from "../../pages/_app"
import { EditProfille } from "../../hooks/auth"

import { makeStyles } from '@mui/styles';
import { EditProfileParams } from "../../types/authitem"

import { getCurrentUser } from "../../hooks/auth"

import { setCookie } from 'nookies';

const useStyles = makeStyles(() => ({
  redButton: {
    fontSize: '1rem',
    fontWeight: 500,
    backgroundColor: theme.palette.grey[50],
    border: '1px solid',
    borderColor: theme.palette.grey[700],
    color: theme.palette.grey[700],
    textTransform: 'none',
    '&:hover': {
        backgroundColor: theme.palette.primary.light
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.875rem'
    }
  },
  loginIcon: {
    marginRight: '16px',
    [theme.breakpoints.down('sm')]: {
        marginRight: '8px'
    }
  },
  signDivider: {
      flexGrow: 1
  },
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
  authsocial: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const EditProfileForm = () => {
  const classes = useStyles();
  const router = useRouter();
  const { currentUser, setLoading,setIsSignedIn,setCurrentUser } = useContext(AuthContext)
  const [email, setEmail] = useState<string>(currentUser ? currentUser.email : "")
  const [name, setName] = useState<string>(currentUser ? currentUser.name : "")
  const [nickname, setNickname] = useState<string>(currentUser ? currentUser.nickname ?? "" : "")
  const { setIsDialog, setDialogMsg ,setTitleDialog} = useContext(Dialogcontext)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoading(true)
    const params: EditProfileParams = {
      email: email,
      name: name,
      nickname: nickname
    }

    await EditProfille(params).then(response => {
      if (response.status === 200) {
        setIsDialog(true)
        setTitleDialog("プロフィール編集成功")
        setDialogMsg("プロフィールの編集に成功しました。")
        router.push("/")
      }
    }).catch(error => {
      setIsDialog(true)
      setTitleDialog("プロフィール編集エラー")
      setDialogMsg(error.response.data.errors.full_messages.join(""))
    })

    setLoading(false)
  }

  const handleGetCurrentUser = async () => {
    setLoading(true)
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
        setCurrentUser(res?.data.data)
        setEmail(res?.data.data.email)
        setName(res?.data.data.name)
        setNickname(res?.data.data.nickname)
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    handleGetCurrentUser()
  }, [setCurrentUser]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" gutterBottom>
          プロフィール編集
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="email"
                name="email"
                label="メールアドレス"
                fullWidth
                variant="standard"
                autoComplete="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="name"
                name="name"
                label="名前"
                fullWidth
                variant="standard"
                autoComplete="name"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="nickname"
                name="nickname"
                label="ニックネーム"
                fullWidth
                variant="standard"
                autoComplete="nickname"
                value={nickname}
                onChange={event => setNickname(event.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}>
            編集
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default EditProfileForm;