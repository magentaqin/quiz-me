import Image from 'next/image'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import styles from '../styles/Home.module.scss'

const NavBar = () => {
    return (
			<div className={styles.navbar}>
				<Image src="/logo.png" height={50} width={200} alt="logo" />
				<Stack direction="row" spacing={2}>
				  <Button variant="text" size="small">Sign Up</Button>
				  <Button variant="contained" size="small">Login</Button>
				</Stack>
			</div>
    )
}

export default NavBar

