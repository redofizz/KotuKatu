import Header from '../components/Header'
import EditArticleForm from '../components/EditArticleForm'
import Box from '@mui/material/Box';

const EditArticle = () => {
  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <EditArticleForm />
      </Box>
    </>
  )
}

export default EditArticle