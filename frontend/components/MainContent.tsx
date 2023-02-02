import { Fragment, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import SearchInput from './SearchInput'
import QuizTable from './QuizTable'
import styles from '../styles/Home.module.scss'

export default function MainContent() {
  const [keyword, setKeyword] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const searchList = (params: string | string[]) => {
    if (typeof params === 'string') {
      setKeyword(params)
    } else {
      setTags(params)
    }
  }
  return (
    <Fragment>
      <CssBaseline />
      <Container fixed>
        <div className={styles.searchContainer}>
          <SearchInput onInputChange={searchList} onTagsChange={searchList}/>
        </div>
        <QuizTable keyword={keyword} tags={tags} />
      </Container>
    </Fragment>
  );
}
