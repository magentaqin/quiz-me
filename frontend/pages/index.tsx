import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import NavBar from '../components/Navbar'
import MainContent from '../components/MainContent'
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>QuizMe</title>
        <meta name="description" content="Quiz yourself on frontend!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NavBar />
        <MainContent />
        <Link href="/editor">
          <a>to editor</a>
        </Link>
      </main>
    </div>
  )
}

export default Home
