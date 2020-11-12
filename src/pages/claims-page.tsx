import React, { FC, Fragment } from 'react';
import { useService } from 'react-service-container';
import { User } from '../models/user';

const ClaimsPage : FC = () => {
    const user = useService(User);
    
    return (
        <Fragment>
            <h1>Bienvenue</h1>
            <p>{user.displayName}</p>
        </Fragment>);
};

export default ClaimsPage;
