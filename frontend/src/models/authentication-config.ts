export default class AuthenticationConfig {
    authority: string = '';
    clientId: string = '';
    redirectUri: string = '';
    forgotPasswordPolicy: string ='';
    apiScope: string = '';

    constructor(init?: Partial<AuthenticationConfig>) {
        Object.assign(this, init);
    }
}
