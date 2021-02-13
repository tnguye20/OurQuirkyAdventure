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
  MemoryContextProvider,
  FilterContextProvider
} from './contexts';
import {
  AuthRoute,
  UnAuthRoute,
  Login,
  Logout,
  Slides,
  Upload,
  Header,
  Gallery
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
                </AuthContextWrapper>

                <AuthRoute path={ ROUTES.LOGOUT }>
                  <Logout />
                </AuthRoute>

                <AuthContextWrapper path={ ROUTES.GALLERY }>
                    <Gallery />
                </AuthContextWrapper>
                <AuthContextWrapper path={ ROUTES.ROOT }>
                  <MemoryContextProvider>
                    <Slides />
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
        <FilterContextProvider>
          { children }
          <Header />
        </FilterContextProvider>
      </UserContextProvider>
    </AuthRoute>
  )
}

export default App;
