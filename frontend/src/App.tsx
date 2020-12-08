import React, { FC, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import { Layout, Menu } from 'antd';
import ApiPage from './pages/api-page';
import HomePage from './pages/home-page';
import './App.css';
import { ServiceContainer } from 'react-service-container';
import AuthenticationService from './services/authentication-service';
import { User } from './models/user';
import { UsersService } from './services/users-service';
import CustomersService from './services/customers-service';
import LoginPage from './pages/login-page';

const usersService = new UsersService();

const authService = new AuthenticationService(
  usersService,
  {
  authority: process.env.REACT_APP_AAD_B2C_AUTHORITY as string,
  clientId: process.env.REACT_APP_AAD_B2C_CLIENT_ID as string,
  redirectUri: process.env.REACT_APP_AAD_B2C_REDIRECT_URI as string,
  forgotPasswordPolicy: process.env.REACT_APP_AAD_B2C_FORGOT_PASSWORD_POLICY as string,
  apiScope: process.env.REACT_APP_AAD_B2C_API_SCOPE as string
});

const userPromise = authService.getUser();

const App: FC = () => {
  const [currentUser, setCurrentUser] = useState(new User());

  userPromise.then(u => {
    setCurrentUser(u);
  });

  return (
  <ServiceContainer providers={[ {provide: User, useValue: currentUser },
    { provide: AuthenticationService, useValue: authService },
    CustomersService]}>
    <Router>
      <Layout className="layout">
        <Layout.Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/api">API</Link></Menu.Item>
          </Menu>
        </Layout.Header>
        <Layout.Content style={{ padding: '0.5em 0 0 1.5em' }}>
          <div className="site-layout-content">
            <Switch>
              <Route path="/login-aad">
                <LoginPage />
              </Route>
              <Route path="/login-google">
                <LoginPage />
              </Route>
              <Route path="/api">
                <ApiPage />
              </Route>
              <Route path="/">
                <HomePage />
              </Route>
            </Switch>
          </div>
        </Layout.Content>
      </Layout>
    </Router>
  </ServiceContainer>);
}

export default App;
