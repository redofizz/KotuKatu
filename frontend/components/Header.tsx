import React, { useContext } from "react"

import Link from 'next/link';
import { useRouter } from 'next/router';

import { destroyCookie } from 'nookies';
import { makeStyles } from "@mui/styles"
import theme from '../pages/theme'

import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Hidden from '@mui/material/Hidden';
import Drawer from "@mui/material/Drawer";
import Divider from '@mui/material/Divider';
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Dialogcontext } from "../pages/_app"
import { AuthContext } from "../pages/_app"
import { signOut } from "../hooks/auth"

const drawerWidth = 240;

const AUTH_MENU_LIST = [
  {
    title: 'HOME',
    icon: '',
    href: '/',
  },
  {
    title: 'ADDARTICLE',
    icon: '',
    href: '/editarticle',
  },
  {
    title: 'MYPROFILE',
    icon: '',
    href: '/editprofile',
  }
];

const MENU_LIST = [
  {
    title: 'HOME',
    icon: '',
    href: '/',
  },
  {
    title: 'SIGNIN',
    icon: '',
    href: '/signin',
  },
  {
    title: 'SIGNUP',
    icon: '',
    href: '/signup',
  }
];

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  iconButton: {
    marginRight: theme.spacing(2),
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  title: {
    flexGrow: 1,
    textDecoration: "none",
    color: "inherit"
  },
  appBarMenuItem: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  appBarMenuItemLink: {
    color: 'white',
    textDecoration: 'none',
    cursor: 'pointer',
  },
}));

const Header = (props: Props) => {
  const { window } = props;
  const { loading, setLoading, isSignedIn, setIsSignedIn } = useContext(AuthContext)
  const { setIsDialog, setDialogMsg, setTitleDialog } = useContext(Dialogcontext)
  const classes = useStyles()
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
          <>
            {AUTH_MENU_LIST.map(({ title, icon, href }) => {
              return (
                <Typography className={classes.appBarMenuItem} key={title} noWrap>
                  <Link href={href}>
                    <span className={classes.appBarMenuItemLink}>{title}</span>
                  </Link>
                </Typography>
              );
            })}
            <Typography className={classes.appBarMenuItem} key="SIGNOUT" onClick={handleSignOut} noWrap>
              <span className={classes.appBarMenuItemLink}>SIGNOUT</span>
            </Typography>
          </>
        )
      } else {
        return (
          <>
            {MENU_LIST.map(({ title, icon, href }) => {
              return (
                <Typography className={classes.appBarMenuItem} key={title} noWrap>
                  <Link href={href}>
                    <span className={classes.appBarMenuItemLink}>{title}</span>
                  </Link>
                </Typography>
              );
            })}
          </>
        )
      }
    } else {
      return <></>
    }
  }

   const AuthDrawers = () => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <>
            <div>
              <div className={classes.toolbar} />
              <Divider />
              <List>
                {
                  AUTH_MENU_LIST.map(({ title, icon, href }, index) => (
                    <ListItem
                      button
                      key={title}
                      onClick={() => {
                        setMobileOpen(false);
                        router.push(href);
                      }}
                    >
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={title} />
                    </ListItem>
                  ))
                }
              </List>
            </div>
          </>
        )
      } else {
        return (
          <>
            <div>
              <div className={classes.toolbar} />
              <Divider />
              <List>
                {
                  MENU_LIST.map(({ title, icon, href }, index) => (
                    <ListItem
                      button
                      key={title}
                      onClick={() => {
                        setMobileOpen(false);
                        router.push(href);
                      }}
                    >
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={title} />
                    </ListItem>
                  ))
                }
              </List>
            </div>
          </>
        )
      }
    } else {
      return <></>
    }
   };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6"
            className={classes.title}
            onClick={() => {
              router.push('/');
            }}
          >
            KotuKatu
          </Typography>
          <AuthButtons />
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={'right'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <AuthDrawers />
          </Drawer>
        </Hidden>
      </nav>
      <div className={classes.toolbar} />
    </>
  )
}

export default Header