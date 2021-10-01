import React from "react"
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { makeStyles } from '@mui/styles';
import theme from '../pages/theme';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { ArticleItem } from "../types/articleitem"

import moment from 'moment'
import 'moment/locale/ja' 

const useStyles = makeStyles(() => ({
  card: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5)
  }
}));

interface Props {
  article: ArticleItem;
}

const ArticleCard: React.VFC<Props> = ({ article }) => {
  const classes = useStyles();

  return (
  <React.Fragment>
    <Card className={classes.card} variant="outlined">
      <CardHeader
        avatar={
          <Avatar alt={article.user.name} src={article.user.image} />
        }
        title={article.user.nickname ?? article.user.name }
        subheader={moment(article.created_at).fromNow()}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {article.title}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {article.body.split("\n").map((i,key) => {
            return <div key={key}>{i}</div>;
        })}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
      </CardActions>
    </Card>
  </React.Fragment>
  )
};

export default ArticleCard