import { Button } from 'antd';
import Form from 'antd/lib/form/Form';
import React, { FC, Fragment } from 'react';
import { useService } from 'react-service-container';
import AuthenticationService from '../services/authentication-service';

const HomePage: FC = () => {
    const authService = useService(AuthenticationService);

    return (
    <Fragment>
        <h1>Home</h1>
        <Form>
            <p>
                Click here to login using AAD <Button onClick={() => authService.login()}>Login</Button>
            </p>
            <p>
                Click here to logout from AAD <Button onClick={() => authService.logout()}>Logout</Button>
            </p>
        </Form>
    </Fragment>)
};

export default HomePage;
