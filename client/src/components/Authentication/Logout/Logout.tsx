import * as React from 'react';
import Typography from '@material-ui/core/Typography';
// import GlassesIcon from '../../CustomIcons/GlassesIcon';
// import GoogleIcon from '../../CustomIcons/GoogleIcon';

import { useHistory } from 'react-router-dom';

import { ROUTES } from '../../../shared/config';
import { auth } from '../../../libs';
import { useAuthValue } from '../../../contexts';
import CircularProgress from '@material-ui/core/CircularProgress';

import './Logout.css';
import { AuthToken } from '../../../interfaces';

export const Logout = () => {
  const { setAuthUser } = useAuthValue();
  const history = useHistory();

  React.useEffect(() => {
    auth.signOut().then(() => {
      setTimeout( () => {
        const emptyAuthToken = new AuthToken(null, null);
        setAuthUser!(emptyAuthToken);
        localStorage.removeItem("idToken");
        localStorage.removeItem("uid");

        history.push(ROUTES.LOGIN);
      } , 1000 );
    });
  });

  return (
    <div className="Logout">
      <div className="Logout-card ">
        {/* <GlassesIcon size='100px' /> */}
        <Typography variant="h4" color='textPrimary'>Our Quirky Adventure</Typography>
        <Typography variant="h5" color='textPrimary'>Logging Out...</Typography>
        <CircularProgress style={{margin: '10px'}}/>
      </div>

    </div>
  );
}