import Header from '../components/Header'
import EditProfileForm from '../components/authentication/EditProfileForm'
import Box from '@mui/material/Box';

const Editprofile = () => {
  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <EditProfileForm />
      </Box>
    </>
  )
}

export default Editprofile