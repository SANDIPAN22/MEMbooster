import React from 'react'
import MyContainer from '../components/MyContainer'
import { Typography } from '@mui/material'
import MyBreadcrumbs from '../components/MyBreadcrumbs'
import NoteForm from '../components/NoteForm'
import useLocalStorage from '../shared/useLocalStorage'
import {NoteDataType} from '../shared/commonTypes'

const NewNote = () => {
  const blank_notes : NoteDataType[] = []
  const [notes, setNotes] = useLocalStorage('notes', blank_notes)
  
  const saveNote= (currNote: NoteDataType) => {
    
    
    setNotes((prevNotes : NoteDataType[])=> {
      console.log("Previous status ==>", prevNotes)
      return [...prevNotes, currNote]
    })

  }
  return (
    <MyContainer>
    <MyBreadcrumbs paths={['home', 'new_note']}/>
    
    <Typography variant='h2' >
      Add Note
    </Typography>
    <NoteForm saveNote={saveNote}/>



</MyContainer>
  )
}

export default NewNote