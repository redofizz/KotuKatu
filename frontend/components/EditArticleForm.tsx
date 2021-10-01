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

import theme from '../pages/theme'

import { AuthContext } from "../pages/_app"
import { Dialogcontext } from "../pages/_app"
import { PostArticle } from "../hooks/article"

import { makeStyles } from '@mui/styles';
import { PostArticleParams } from "../types/articleitem"

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

const EditArticleForm = () => {
  const classes = useStyles();
  const router = useRouter();
  const { setLoading } = useContext(AuthContext)
  const [title, setTitle] = useState<string>("")
  const [body, setBody] = useState<string>("")
  const { setIsDialog, setDialogMsg ,setTitleDialog} = useContext(Dialogcontext)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoading(true)
    const params: PostArticleParams = {
      title: title,
      body: body
    }

    await PostArticle(params).then(response => {
      if (response.status === 200) {
        setIsDialog(true)
        setTitleDialog("記事投稿成功")
        setDialogMsg("記事の投稿に成功しました。")
        router.push("/")
      }
    }).catch(error => {
      setIsDialog(true)
      setTitleDialog("記事投稿エラー")
      setDialogMsg(error.response.data.errors.full_messages.join(""))
    })

    setLoading(false)
  }

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
                id="title"
                name="title"
                label="タイトル"
                fullWidth
                variant="standard"
                autoComplete="title"
                value={title}
                onChange={event => setTitle(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="body"
                name="body"
                label="本文"
                multiline
                rows={5}
                fullWidth
                variant="standard"
                autoComplete="body"
                value={body}
                onChange={event => setBody(event.target.value)}
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
            投稿
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default EditArticleForm;