import { Role } from "./role";

export class User {
    id?: string;
    firstname?: string;
    lastname?: string;
    role?: Role;
    isAuthenticated: boolean;

    get displayName() {
        return `${this.firstname} ${this.lastname}` ;
    }

    constructor(id?: string, firstname?: string, lastname?: string,role?: Role, isAuthenticated?: boolean) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.role = role;
        this.isAuthenticated = !!isAuthenticated;
    }
}
