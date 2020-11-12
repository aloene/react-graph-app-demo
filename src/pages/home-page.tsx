import { Button } from 'antd';
import Form from 'antd/lib/form/Form';
import React, { FC, Fragment } from 'react';
import { useService } from 'react-service-container';
import { User } from '../models/user';
import AuthenticationService from '../services/authentication-service';

const HomePage: FC = () => {
    const user = useService(User);
    const authService = useService(AuthenticationService);

    return (
    <Fragment>
        <h1>Home</h1>
        <Form>
            { user.isAuthenticated &&
                <p>
                    Click here to logout from AAD <Button onClick={() => authService.logout()}>Logout</Button>
                </p>
            }
        </Form>
    </Fragment>)
};

export default HomePage;
