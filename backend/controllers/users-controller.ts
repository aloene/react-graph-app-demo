import { Request, Response } from 'express';
import { UsersService } from '../services/users-service';

export class UsersController {
  public current(req: Request, res: Response) {
    let usersService = new UsersService();

    usersService.getUsersByName('test').then(_ => 
      res.json(req.user));
    
  }
}