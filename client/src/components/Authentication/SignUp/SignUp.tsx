import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import EmailIcon from '@material-ui/icons/Email';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { CustomizedAlert } from '../../CustomizedAlert';

import { useHistory } from 'react-router-dom';

import { ROUTES } from '../../../shared/config';
import { auth } from '../../../libs';
import { useAuthValue } from '../../../contexts';

import './SignUp.css';
import { AuthToken, User } from '../../../interfaces';
import { useAlert } from '../../../hooks';
import { UserDao } from '../../../daos';
const useStyles = makeStyles((theme) => ({
  button: {
    margin: '10px',
    width: '80%'
  },
}))


export const SignUp = () => {
  const classes = useStyles();
  const { setAuthUser } = useAuthValue();
  const { openAlert, setAlertMessage, setOpenAlert, alertMessage, alertType} = useAlert();
  const history = useHistory();
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [displayName, setDisplayName] = React.useState<string>('');

  const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      if (user) {
        const dao = new UserDao(user.uid);
        const newUser: User = {
          id: user.uid,
          displayName,
          email
        };

        await dao.add(newUser);

        const idToken = await user.getIdToken();
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("uid", user.uid);
        const authToken = new AuthToken(user.uid, idToken);

        setAuthUser!(authToken);
        history.push(ROUTES.ROOT);
      }
    }
    catch (error) {
      if (error.code) {
        console.log(error.message);
        setAlertMessage(error.message);
      }
      setOpenAlert(true);
    }
  }

  return (
    <>
    <div className="Login">
      <div className="Login-card ">
        <Typography variant="h4" color='textPrimary'>Our Quirky Adventure</Typography>
        <Typography variant="h6" color='textPrimary'>Welcome to the family</Typography>
        <TextField 
          autoFocus
          className='Login-field'
          onChange={(e) => {setDisplayName(e.target.value)}}
          style={{
            height: '40px',
            margin: '5px'
          }}
          inputProps={{
            style: { height: '3px'}
          }}
          id="outlined-display-name-basic" 
          label="Name" 
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment  
          position="start"><AccountCircleIcon fontSize='small' /></InputAdornment>,
          }}
        />
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
          id="outlined-email-basic" 
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
          id="outlined-password-basic" 
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
          disabled={displayName.length === 0 || email.length === 0 || password.length === 0}
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
      </div>

    </div>
      <CustomizedAlert duration={5000} openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={alertMessage} alertType={alertType}/>
    </>
  );
}