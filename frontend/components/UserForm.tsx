import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import { FormType } from './Navbar'
import { signupApi, loginApi } from '../api/user'

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  formType: FormType;
}

export default function UserForm(props: Props) {
  const { open, setOpen } = props
  const [title, setTitle] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [email, setEmail ] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const submit = () => {
    if (props.formType === 'signup') {
      console.log(email, username, password)
    }
    setOpen(false)
  }

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    if (props.formType === "signup") {
      setTitle('Sign Up')
    }
    if (props.formType === "login") {
      setTitle('Login')
    }
  }, [props.formType])

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={handleEmail}
          />
           <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={username}
            onChange={handleUsername}
          />
           <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="text"
            fullWidth
            variant="standard"
            value={password}
            onChange={handlePassword}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={submit}>{title}</Button>
        </DialogActions>
      </Dialog>
      {showAlert ? (
        <Alert severity="success" color="info">
          {title} successfully!
        </Alert>
      ) : null}
    </div>
  );
}
