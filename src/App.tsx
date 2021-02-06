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
  UserContextProvider
} from './contexts';
import {
  AuthRoute,
  UnAuthRoute,
} from './components';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Switch>
            <AuthRoute path={ ROUTES.ROOT }>
              <div className="App">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                </header>
              </div>
            </AuthRoute>
        </Switch>
      </Router>

    </AuthContextProvider>
  );
}

export default App;
