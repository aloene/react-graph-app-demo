import { Role } from "./role";

export class User {
    email?: string;
    displayName?: string;
    role?: Role;
    isAuthenticated: boolean;

    constructor(email?: string, displayName?: string, role?: Role, isAuthenticated?: boolean) {
        this.email = email;
        this.displayName = displayName;
        this.role = role;
        this.isAuthenticated = !!isAuthenticated;
    }
}
