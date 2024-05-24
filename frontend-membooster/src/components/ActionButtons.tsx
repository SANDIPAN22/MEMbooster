import React from 'react'
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';
import { Link } from 'react-router-dom';

const ActionButtons = () => {
  return (
    <Box sx={{ '& > :not(style)': { m: 1 } , position: 'fixed', right: '5%', top: '85%'}}>
    <Link to={'/new_note'}>
    <Fab variant="extended">
    <AddIcon />
      Add Note
    </Fab>
    </Link>
   
  </Box>
  )
}

export default ActionButtons
