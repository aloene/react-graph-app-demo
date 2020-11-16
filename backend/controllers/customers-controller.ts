import { Request, Response } from 'express';
import { Customer } from '../models/customer';

export class CustomersController {
  public all(req: Request, res: Response) {
    // Simulate API load time (250ms)
    setTimeout(() => 
      res.json([
        new Customer(1, 'Grant Thornton'),
        new Customer(2, 'Neos-SDI'),
        new Customer(3, 'Client 3')]), 250);
  }
}