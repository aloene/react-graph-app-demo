import express from 'express';
import bodyParser from 'body-parser';
import { Routes } from "./routes";
import cors from 'cors';
import { config } from './config'
import { User } from 'models/user';
import jwt from 'express-jwt';
import jwksRsa from "jwks-rsa";

class Application {
  private _app: express.Application;
  
  constructor() {
    this._app = express();
    this.config();
    new Routes().routes(this._app);
  }

  private config(): void {
    const checkJwt = jwt({
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${config.aad.tenant}.b2clogin.com/${config.aad.tenantId}/${config.aad.policy}/discovery/v2.0/keys`
      }),
    
      // Validate the audience and the issuer.
      audience: config.aad.clientId,
      issuer: `https://${config.aad.tenant}.b2clogin.com/${config.aad.tenantId}/v2.0/`,
      algorithms: ['RS256']
    });

    this._app.use(cors());
    this._app.use(bodyParser.json());
    this._app.use(bodyParser.urlencoded({ extended: false }));
    this._app.use(checkJwt);
    this._app.use((req, res, next) => {
      // Get user from DB (true = found)
      if (true) {
        req.user = {
          id: req.user['oid'],
          role: 'Admin',
          firstname: req.user['family_name'],
          lastname: req.user['given_name']
        } as User;
        next();
      } else {
        // User not found in DB
        res.status(403).send('Not authorized');
      }
    });
  }

  run() {
    const PORT = process.env.PORT || 4000;
    this._app.listen(PORT, () => console.log(`API listening on port ${PORT}!`));
  }
}

export default Application;
