import axios from 'axios';
import { Customer } from '../models/customer';

export default class CustomersService {
    getAll(): Promise<Customer[]> {
        return axios.get<Customer[]>('http://localhost:4000/customers').then(r => r.data);
    }
}
