import React, { useContext, useEffect, useState } from "react"
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Header from '../components/Header'
import ArticleCard from '../components/ArticleCard'
import { AuthContext } from "../pages/_app"
import { GetArticle } from "../hooks/article"
import { ArticleItemResponse, ArticleItem } from "../types/articleitem"



// とりあえず認証済みユーザーの名前やメールアドレスを表示
const Home: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext)
  const { setLoading } = useContext(AuthContext)
  const [articles, setArticles] = useState<Array<ArticleItem>>([]);
  const handleGetArticles = async () => {
    setLoading(true)
    try {
      const res = await GetArticle()
      if (res?.data.success) {
        setArticles(
          res.data.data.map<ArticleItem>((d) => {
            return {
              id: d.id,
              title: d.title,
              body : d.body,
              user_id: d.user_id,
              created_at: d.created_at,
              updated_at: d.updated_at,
              user:{
                id: d.user.id,
                uid: d.user.uid,
                provider: d.user.provider,
                email: d.user.email,
                name: d.user.name,
                nickname: d.user.nickname,
                image: d.user.image,
                allowPasswordChange: d.user.allowPasswordChange,
                created_at: d.user.created_at,
                updated_at: d.user.updated_at,
              }
            };
          })
        )
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    handleGetArticles()
  }, []);

  return (
    <>
      <Header />
      <Grid container spacing={3}>
        {
          articles.map((article) => {
            return (
              <>
                <Grid sm={2} />
                <Grid item xs={12} sm={8}>
                  <ArticleCard key={article.id} article={article} />
                </Grid>
                <Grid sm={2} />
              </>
            );
          })
        }
      </Grid>
    </>
  )
}

export default Home