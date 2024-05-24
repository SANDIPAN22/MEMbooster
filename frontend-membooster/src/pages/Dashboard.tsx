import React, {useRef, useState} from 'react'
import { Box, TextField, Button  } from '@mui/material'
import MyContainer from '../components/MyContainer'
import { Typography } from '@mui/material'
import MyBreadcrumbs from '../components/MyBreadcrumbs'
import RenderAllNotes from '../components/RenderAllNotes'
import useLocalStorage from '../shared/useLocalStorage'
import ActionButtons from '../components/ActionButtons'

// interface FilterNotes {
//   searchingTitle: string,
//   searchingTags: string[]
// }

const Dashboard = () => {

  const TitleRef = useRef<HTMLInputElement>(null)
  const TagsRef = useRef<HTMLInputElement>(null)
  const [notes, setNotes] = useLocalStorage('notes', [])
 
  const [filters, setFilters] = useState({})
  

  const handleKeyUp = ()=>{
    const searchingTitle = TitleRef.current?.value
    const searchingTags = TagsRef.current?.value ? TagsRef.current?.value.split(',') : []

      setFilters({searchingTitle, searchingTags})

  }
  return (
    <MyContainer>
      <MyBreadcrumbs paths={['home']}/>
        <Typography variant='h2' >
          Notes
        </Typography>

        <form >
    <Box mt={5} display={'flex'} justifyContent={'space-between'}>
        <TextField
            required
            id="outlined-required"
            label="Title"
            inputRef={TitleRef}
            sx={{
                width: "50%"
            }}
            onChange={handleKeyUp}
            />

        <TextField
            required
            id="outlined-required"
            label="Tags"
            inputRef={TagsRef}
            placeholder="Put Comma Seperated Values"
            sx={{
                width: "45%"
            }}
            onChange={handleKeyUp}
            /> 
        </Box>
        </form> 

        <RenderAllNotes notes={notes} filters={filters}></RenderAllNotes>
        
      <ActionButtons/>
    </MyContainer>
  )
}

export default Dashboard