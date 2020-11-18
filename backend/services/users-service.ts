import * as msal from '@azure/msal-node';
import { config } from '../config';

export class UsersService {
    private _confidentialClient: msal.ConfidentialClientApplication;
    private _gestionTiersApiTokenRequest: msal.ClientCredentialRequest;

    constructor() {
        this._gestionTiersApiTokenRequest = {
            scopes: [ config.aad.gestionTiersApiUri ]
        };
        this._confidentialClient = new msal.ConfidentialClientApplication({
            auth: {
                clientId:  config.aad.clientId,
                clientSecret: config.aad.clientSecret,
                // Client Credentials flow is not supported on B2C endpoints, use underlying AAD authority...
                authority: `https://login.microsoftonline.com/${config.aad.tenantId}`,
            }
        });

    }

    getUsersByName(name: string): Promise<any> {
        return this._confidentialClient.acquireTokenByClientCredential(this._gestionTiersApiTokenRequest).then(t => {
                console.log(t.accessToken);
                return null;
        });
    }
}