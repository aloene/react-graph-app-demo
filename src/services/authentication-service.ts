import { AuthenticationResult, PublicClientApplication } from "@azure/msal-browser";
import AuthenticationConfig from "../models/authentication-config";
import Deferred from "./deferred";

export default class AuthenticationService {
    private _publicClient: PublicClientApplication;
    private _msalCallback: (value: AuthenticationResult | null) => void;
    private _accountDeferred: Deferred<any>;

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

        this._msalCallback = this.handleAuthResponse.bind(this);

        this._publicClient.handleRedirectPromise()
            .then(this._msalCallback)
            .catch(error => {
                console.error(error);

                // if (error.errorMessage.indexOf("AADB2C90118") > -1) {
                //     try {
                //         this._publicClient.loginRedirect(
                //             {
                //                 scopes: [ 'openid' ],
                //                 redirectUri: this.authConfig.forgotPasswordPolicy    
                //             });
                            
                //     } catch(err) {
                //         console.log(err);
                //     }
                // }
            });

        this._accountDeferred = new Deferred<any>();
    }

    private handleAuthResponse(authResult: AuthenticationResult | null): void {
        let currentAccount = this._publicClient.getAllAccounts()[0];
        Object.assign(currentAccount, { firstname: '', lastname: ''});
        this._accountDeferred.resolver(this._publicClient.getAllAccounts()[0]);
    }

    getClaims(): Promise<any>{
        return this._accountDeferred.promise;
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