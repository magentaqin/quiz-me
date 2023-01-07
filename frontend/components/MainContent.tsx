import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SearchInput from './SearchInput'
import QuizTable from './QuizTable'
import styles from '../styles/Home.module.scss'

export default function MainContent() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <div className={styles.searchContainer}>
          <SearchInput />
        </div>
        <QuizTable />
      </Container>
    </React.Fragment>
  );
}