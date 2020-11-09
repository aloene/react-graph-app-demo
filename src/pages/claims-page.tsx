import React, { Component, Fragment } from 'react';
import { ServiceContainerContext } from 'react-service-container';
import ClaimsComponent from '../components/claims-component';
import { Claim } from '../models/claim';
import AuthenticationService from '../services/authentication-service';

export default class ClaimsPage extends Component<any, { claims: Claim[] }> {
    static contextType = ServiceContainerContext;

    constructor(props: any) {
        super(props);
        this.state = {claims: []};
    }

    async componentDidMount() {
        let account = await this.context.get(AuthenticationService).getClaims();
        let claims = [];
        for (let p in account) {
            claims.push(new Claim(p, account[p]));
        }

        this.setState({claims: claims});
    }
    
    render() {    
        return (
            <Fragment>
                <h1>Claims</h1>
                <ClaimsComponent claims={this.state.claims} />
            </Fragment>);
    }
};
