import { useState, Fragment } from 'react'
import Image from 'next/image'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import styles from '../styles/Home.module.scss'
import UserForm from './UserForm'

type FormType = 'signup' | 'login' | 'question'

const NavBar = () => {
    const [formType, setFormType] = useState<FormType>()
    const [open, setOpen] = useState(false)
    const handleSignup = () => {
      setFormType('signup')
      setOpen(true)
    }
    const handleLogin = () => {
      setFormType('login')
      setOpen(true)
    }
    return (
      <Fragment>
        <div className={styles.navbar}>
				<Image src="/logo.png" height={50} width={200} alt="logo" />
				<Stack direction="row" spacing={2}>
				  <Button variant="text" size="small" onClick={handleSignup}>Sign Up</Button>
				  <Button variant="contained" size="small" onClick={handleLogin}>Login</Button>
				</Stack>
			</div>
       <UserForm open={open} setOpen={setOpen} />
      </Fragment>
    )
}

export default NavBar

