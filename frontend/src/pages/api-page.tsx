import { Button } from 'antd';
import Form from 'antd/lib/form/Form';
import React, { FC, Fragment, useState } from 'react';
import { useService } from 'react-service-container';
import { User } from '../models/user';
import CustomersService from '../services/customers-service';
import { Customer } from '../models/customer';

const ApiPage: FC = () => {
    const customersService = useService(CustomersService);
    const user = useService(User);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadCustomers = () => {
        setIsLoading(true);
        customersService.getAll().then(customers => {
            setCustomers(customers);
            setIsLoading(false);
        });
    };

    return (
        <Fragment>
            <h1>API call example</h1>
            <Form>
                { user.isAuthenticated &&
                    <Fragment>
                    <p>
                        Click here to get all customers from backend <Button onClick={() => loadCustomers()}>Call API</Button>
                    </p>
                    </Fragment>
                }
            </Form>
            { isLoading &&
                <p><em>Loading...</em></p>
            }
            <ul>
                {customers.map(c => <li key={c.id}>{c.id} - {c.name}</li>)}
            </ul>
        </Fragment>);
}

export default ApiPage;
