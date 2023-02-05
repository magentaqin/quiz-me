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
  const [failMsg, setFailMsg] = useState('')
  const [showSuccessMsg, setShowSuccessMsg] = useState(false)
  const [email, setEmail ] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSuccess = () => {
    setShowSuccessMsg(true)
    let timer = setTimeout(() => {
      clearTimeout(timer)
      setShowSuccessMsg(false)
      setOpen(false)
    }, 2000)
  }

  const handleFail = (msg: string) => {
    setFailMsg(msg)
    let timer = setTimeout(() => {
      clearTimeout(timer)
      setFailMsg('')
    }, 2000)
  }

  const submit = () => {
    if (props.formType === 'signup') {
      const params = {
        email,
        userName: username,
        password
      }
      signupApi(params).then((res) => {
        if (res?.data?.token) {
          localStorage.setItem('quizme_token', res.data.token)
          handleSuccess()
        }
      }).catch((err) => {
        handleFail(err.response.data.msg)
      })
    }
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
           {props.formType === 'signup' ? (
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
           ) : null}
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
        {showSuccessMsg ? (
        <Alert variant="filled" severity="success">
          {title} successfully!
        </Alert>
      ) : null}
      {failMsg ? (
         <Alert variant="filled" severity="error">
         {failMsg}
       </Alert>
      ) : null}
      </Dialog>
    </div>
  );
}
