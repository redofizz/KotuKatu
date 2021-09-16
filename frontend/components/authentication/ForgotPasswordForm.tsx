import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


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

const useStyles = makeStyles((theme) => ({
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
  const registerUser = async (event: any) => {
    event.preventDefault()

    const params: ResetPasswordParams = {
      email: email,
      redirect_url: process.env.NEXT_PUBLIC_FRONTENDBASEURL + "changepass" ?? "http://localhost:3000/" + "changepass"
    }

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