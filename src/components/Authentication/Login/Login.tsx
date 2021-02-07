import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import EmailIcon from '@material-ui/icons/Email';
import InputAdornment from '@material-ui/core/InputAdornment';
import LockIcon from '@material-ui/icons/Lock';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
// import GlassesIcon from '../../CustomIcons/GlassesIcon';
// import GoogleIcon from '../../CustomIcons/GoogleIcon';

import { useHistory } from 'react-router-dom';

import { ROUTES } from '../../../shared/config';
import { auth } from '../../../lib';
import { useAuthValue } from '../../../contexts';

import './Login.css';
const useStyles = makeStyles((theme) => ({
  button: {
    margin: '10px',
    width: '80%'
  },
}))


export const Login = () => {
  const classes = useStyles();
  const { setAuthUser } = useAuthValue();
  const history = useHistory();
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { user } = await auth.signInWithEmailAndPassword(email, password);
    if (user) {
      const idToken = await user.getIdToken();
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("uid", user.uid);
      setAuthUser!({
        idToken,
        uid: user.uid
      });
      history.push(ROUTES.ROOT);
    }

  }

  return (
    <div className="Login">
      <div className="Login-card ">
        {/* <GlassesIcon size='100px' /> */}
        <Typography variant="h4" color='textPrimary'>Our Quirky Adventure 💕</Typography>
        <TextField 
          className='Login-field'
          onChange={(e) => {setEmail(e.target.value)}}
          style={{
            height: '40px',
            margin: '5px'
          }}
          inputProps={{
            style: { height: '3px'}
          }}
          id="outlined-basic" 
          label="Email" 
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment  
          position="start"><EmailIcon fontSize='small' /></InputAdornment>,
          }}
        />
        <TextField 
          className='Login-field'
          onChange={(e) => {setPassword(e.target.value)}}
          style={{
            height: '40px',
            margin: '5px'
          }}
          inputProps={{
            style: { height: '3px'}
          }}
          id="outlined-basic" 
          type="password" 
          label="Password" 
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment  
          position="start"><LockIcon fontSize='small' /></InputAdornment>,
          }}
        />

        <Button
          variant="contained"
          color="default"
          className={classes.button}
          disabled={email.length === 0 || password.length === 0}
          onClick={handleLogin}
        >
          Sign in
        </Button>
        {/* OR
        <Button
          variant="contained"
          color="default"
          disabled
          className={classes.button}
          // startIcon={<GoogleIcon size='20px' />}
        >
        Sign in with google
        </Button> */}
        <Typography variant="subtitle2" color='textPrimary'>
          <Link href="/signup" >
            I need an account! 
          </Link>
        </Typography>
        {/* <Typography variant="subtitle2" color='textPrimary'>
          <Link href="/reset" >
            I forgot my password! 
          </Link>
        </Typography> */}
      </div>

    </div>
  );
}