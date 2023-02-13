import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { getQuestionApi } from '../../api/question'

const QuestionPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    getQuestionApi({ id: id as string }).then(res => {
      const { title, description } = res.data
      setTitle(title)
      setDescription(description)
    })
  }, [])

  return (
    <div>
      <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Add Answer</Button>
      </CardActions>
    </Card>
    </div>
  )
}

export default QuestionPage
