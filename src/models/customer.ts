export class Customer {
    id: number;
    name: string;

    constructor(init?: Partial<Customer>) {
        this.id = init?.id ?? 0;
        this.name = init?.name ?? '';
    }
}
