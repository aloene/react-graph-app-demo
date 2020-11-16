import express from 'express';
import bodyParser from 'body-parser';
import { Routes } from "./routes";
import cors from 'cors';
import passport from 'passport';
import passportAzureAd from 'passport-azure-ad';
import { config } from './config'
import { User } from 'models/user';

class Application {
  private _app: express.Application;
  
  constructor() {
    this._app = express();
    this.config();
    new Routes().routes(this._app);
  }

  private config(): void {
    const bearerStrategy = new passportAzureAd.BearerStrategy({
      identityMetadata: `https://${config.aad.tenant}.b2clogin.com/${config.aad.tenantId}/${config.aad.policy}/v2.0/.well-known/openid-configuration`,
      clientID: config.aad.clientId,
      issuer: `https://${config.aad.tenant}.b2clogin.com/${config.aad.tenantId}/v2.0/`,
      audience: config.aad.clientId,
      loggingLevel: 'info',
      passReqToCallback: true,
      policyName: config.aad.policy,
      isB2C: true,
    }, (req, token, done) => {
      // Get user from DB (set to null if not found, will not be authorized)
      let user: User = {
        id: token.oid,
        firstname: token['given_name'],
        lastname: token['family_name'],
        role: 'Reader'
      }

      done(null, user, token);
    });

    this._app.use(cors());
    this._app.use(bodyParser.json());
    this._app.use(bodyParser.urlencoded({ extended: false }));
    this._app.use(passport.initialize());
    passport.use(bearerStrategy);
    this._app.use(passport.authenticate(bearerStrategy, {session: false}));
  }

  run() {
    const PORT = process.env.PORT || 4000;
    this._app.listen(PORT, () => console.log(`API listening on port ${PORT}!`));
  }
}

export default Application;
