require('dotenv').config();

class AadConfig {
    tenantId: string;
    tenant: string;
    policy: string;
    clientId: string;
    clientSecret: string;
    gestionTiersApiUri: string;
}

class DbConfig {
    server: string;
    database: string;
}

export class Config {
    aad: AadConfig;
    db: DbConfig;

    constructor(init?: Partial<Config>) {
        Object.assign(this, init);
    }
}

export const config = new Config({
    aad: {
        tenantId: process.env.AAD_B2C_TENANT_ID,
        tenant: process.env.AAD_B2C_TENANT,
        policy: process.env.AAD_B2C_POLICY,
        clientId: process.env.AAD_B2C_CLIENT_ID,
        clientSecret: process.env.AAD_B2C_CLIENT_SECRET,
        gestionTiersApiUri: process.env.AAD_B2C_GESTION_TIERS_API_URI
    },
    db: {
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME
    }
});
