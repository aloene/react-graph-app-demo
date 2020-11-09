import React, { FC, Fragment } from 'react';
import { Claim } from '../models/claim';
import ClaimComponent from './claim-component';

const ClaimsComponent: FC<{claims: Claim[]}> = (props: { claims: Claim[]}) => (
    <Fragment>
        {
        props.claims.map(claim =>
            <ClaimComponent key={claim.name} claim={claim} />)
        }
    </Fragment>
);

export default ClaimsComponent;
