import { Fragment, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SearchInput from './SearchInput'
import QuizTable from './QuizTable'
import styles from '../styles/Home.module.scss'

export default function MainContent() {
  const [keyword, setKeyword] = useState('')
  const searchList = (s: string) => {
    setKeyword(s)
  }
  return (
    <Fragment>
      <CssBaseline />
      <Container fixed>
        <div className={styles.searchContainer}>
          <SearchInput onInputChange={searchList}/>
        </div>
        <QuizTable keyword={keyword} />
      </Container>
    </Fragment>
  );
}