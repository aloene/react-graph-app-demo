import axios from "axios";
import { User } from "../models/user";

export class UsersService {
    getCurrent(): Promise<User> {
        return axios.get<User>('http://localhost:4000/users/current').then(ar => {
            return ar.data;
        });
    }
}