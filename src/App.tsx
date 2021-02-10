import React from 'react';
import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { ROUTES } from './shared/config';
import {
  AuthContextProvider,
  UserContextProvider,
  MemoryContextProvider
} from './contexts';
import {
  AuthRoute,
  UnAuthRoute,
  Login,
  Logout,
  Slides,
  Upload,
  Header
} from './components';

function App() {
  return (
    <AuthContextProvider>
          <Router>
            <Switch>
                <UnAuthRoute path={ ROUTES.LOGIN }>
                  <Login />
                </UnAuthRoute>

                <AuthContextWrapper path={ ROUTES.UPLOAD }>
                    <Upload />
                    <Header />
                </AuthContextWrapper>

                <AuthRoute path={ ROUTES.LOGOUT }>
                  <Logout />
                </AuthRoute>

                <AuthContextWrapper path={ ROUTES.ROOT }>
                  <MemoryContextProvider>
                    <Slides />
                    <Header />
                  </MemoryContextProvider>
                </AuthContextWrapper>
            </Switch>
          </Router>
    </AuthContextProvider>
  );
}

const AuthContextWrapper: React.FC<any> = ({ children, path }) => {
  return (
    <AuthRoute path={ path }>
      <UserContextProvider>
        { children }
      </UserContextProvider>
    </AuthRoute>
  )
}

export default App;
