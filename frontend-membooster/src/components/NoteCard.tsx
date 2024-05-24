import { Box } from '@mui/material'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {NoteDataType} from '../shared/commonTypes'
import Chip from '@mui/material/Chip';

interface NoteCardProps {
    note: NoteDataType
}
const NoteCard = ({note}: NoteCardProps) => {
  return (
    
    <CardContent sx={{border: '1px solid black', borderRadius:'5px', width: '18rem', 
    
    boxShadow: '5px 5px 8px black', '&:hover':{boxShadow: '5px 10px 8px black'},
    
    }}>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        Title
      </Typography>
      <Typography variant="h5" component="div" noWrap={true}>
      {note.title}
      </Typography>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom mt={2}>
        Tags
      </Typography>
      <Typography variant="h6" component="div" noWrap={true}>
        {note.tags.map((tag)=>{
            return <Chip label={tag} />
        })}
      </Typography>
    </CardContent>

  )
}

export default NoteCard