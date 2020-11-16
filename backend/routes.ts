import { CustomersController } from './controllers/customers-controller';
import { Application as ExpressApp } from 'express';
import { UsersController } from "./controllers/users-controller";

export class Routes {
  public usersController: UsersController = new UsersController();
  public customersController: CustomersController = new CustomersController();

  public routes(app: ExpressApp): void {
    app.route("/users/current").get(this.usersController.current);

    app.route("/customers").get(this.customersController.all);
  }
}
