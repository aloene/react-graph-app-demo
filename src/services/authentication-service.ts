import { AccountInfo, AuthenticationResult, PublicClientApplication } from "@azure/msal-browser";
import AuthenticationConfig from "../models/authentication-config";
import { Role } from "../models/role";
import { User } from "../models/user";
import Deferred from "./deferred";

export default class AuthenticationService {
    private _publicClient: PublicClientApplication;
    private _accountDeferred: Deferred<AccountInfo>;

    constructor(private authConfig: AuthenticationConfig) {

        this._publicClient = new PublicClientApplication({
            auth: {
                clientId: authConfig.clientId,
                authority: authConfig.authority,
                redirectUri: authConfig.redirectUri,
                knownAuthorities: [ authConfig.authority.split('/').reduce((p, c, i) => {
                    return i !== 2
                        ? (i < 2 ? '' : p)
                        : (p || '') + c
                })]
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: false
            }
        });

        this.handleAuthResponse = this.handleAuthResponse.bind(this);

        this._publicClient.handleRedirectPromise()
            .then(this.handleAuthResponse)
            .catch(error => {
                console.error(error);
            });

        this._accountDeferred = new Deferred<AccountInfo>();
    }

    private handleAuthResponse(authResult: AuthenticationResult | null): void {
        if (authResult !== null) {
            // Redirected from successfull authentication
            let user = this._publicClient.getAllAccounts()[0];
            console.log('Just logged in, updating identity to ' + user.username);
            this._accountDeferred.resolver(this._publicClient.getAllAccounts()[0]);
        } else {
            // Not redirected from authentication
            let users = this._publicClient.getAllAccounts();
            if (users.length === 1) {
                console.log('Already logged in, updating identity to ' + users[0].username);
                this._accountDeferred.resolver(this._publicClient.getAllAccounts()[0]);
            } else if (users.length === 0) {
                console.log('No logged in accounts.');
                this.login();
            } else {
                console.error('Multiple logged in accounts !');
            }
        }
    }

    getUser(): Promise<User>{
        return this._accountDeferred.promise.then(a => {
            return new User('', a.username, Role.Reader, true);
        });
    }

    login() {
        console.log(`Logging in using authority ${this.authConfig.authority}...`);
        this._publicClient.loginRedirect({
            scopes: ['openid']
        });
    }

    logout() {
        console.log('Logging out...');
        this._publicClient.logout();
    }
}