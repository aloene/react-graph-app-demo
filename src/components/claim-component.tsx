import React, { FC, Fragment } from 'react';
import { Claim } from '../models/claim';

const ClaimComponent: FC<{claim: Claim}> = (props: { claim: Claim}) => (
    <Fragment>
        <dt>{props.claim.name}</dt>
        <dd>{props.claim.value}</dd>
    </Fragment>
);

export default ClaimComponent;
