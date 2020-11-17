import { CustomersController } from './controllers/customers-controller';
import { Application as ExpressApp, Request, Response, NextFunction } from 'express';
import { UsersController } from './controllers/users-controller';

export class Routes {
  public usersController: UsersController = new UsersController();
  public customersController: CustomersController = new CustomersController();

  public routes(app: ExpressApp): void {
    app.route("/users/current").get(this.isAuthorized('Reader', 'Admin'), this.usersController.current);
    app.route("/customers").get(this.isAuthorized('Reader'), this.customersController.all);
  }

  private isAuthorized(... roles: string[]) {
    return (req: Request<any, any, any, any>, res: Response<any>, next: NextFunction) => {
      if (roles.indexOf(req.user['role']) > -1) {
        next();
      }
      else {
        res.status(403).send('Not authorized');
      }
    };
  }
}
