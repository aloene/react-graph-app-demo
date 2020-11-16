import { Request, Response } from 'express';

export class UsersController {
  public current(req: Request, res: Response) {
    res.json(req.user);
  }
}