import { AccountInfo, AuthenticationResult, InteractionRequiredAuthError, PublicClientApplication, SilentRequest } from "@azure/msal-browser";
import AuthenticationConfig from "../models/authentication-config";
import { User } from "../models/user";
import Deferred from "./deferred";
import axios from 'axios';
import { UsersService } from "./users-service";

export default class AuthenticationService {
    private _publicClient: PublicClientApplication;
    private _accountDeferred: Deferred<AccountInfo>;
    private _apiScope: string;

    constructor(
        private _usersService: UsersService,
        authConfig: AuthenticationConfig) {

        // Intercept API requests
        axios.interceptors.request.use(options => {
            return this.getAccessToken()
                .then(token => {
                    options.headers['Authorization'] = 'Bearer ' + token;
                    return options;
                });
        });

        this._apiScope = authConfig.apiScope;
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
            return this._usersService.getCurrent().then(u => {
                return new User(u.id, u.firstname, u.lastname, u.role , true);
            })
        });
    }

    getAccessToken(): Promise<string> {
        const accessTokenLoginRequest : SilentRequest = {
            scopes: [this._apiScope],
            account: this._publicClient.getAllAccounts()[0],
            extraQueryParameters: { provider_type: this.getProviderType() }
        };

        console.log('Getting access token...');
        return this._publicClient.acquireTokenSilent(accessTokenLoginRequest)
            .then(response => {
                if (!response.accessToken)  {
                    console.log('Getting access token with redirect method...');
                    this._publicClient.acquireTokenRedirect(accessTokenLoginRequest);
                    return '';
                } else {
                    return response.accessToken;
                }
            })
            .catch(error => {
                if (error instanceof InteractionRequiredAuthError) {
                    this._publicClient.acquireTokenRedirect(accessTokenLoginRequest);
                } else {
                    console.error('An error occurred while fetching authentication token (silently): ' + error);
                }

                return '';
            });
    }

    private getProviderType(): string {
        // Reuse old login type
        if (!window.localStorage.getItem('auth-type')) {
            window.localStorage.setItem(
                'auth-type',
                window.location.pathname.endsWith('login-aad')
                    ? 'aad'
                    : (window.location.pathname.endsWith('login-google')
                        ? 'google'
                        :'local'));
        }

        return window.localStorage.getItem('auth-type') as string;
    }

    login() {
        let authType = this.getProviderType();

        console.log(`Logging in using ${authType} provider...`);
        this._publicClient.loginRedirect({
            scopes: [this._apiScope],
            extraQueryParameters: { provider_type: authType }
        });
    }

    logout() {
        console.log('Logging out...');
        this._publicClient.logout();
    }
}