module.exports = {
    port: process.env.PORT || 8081,
    db: {
        database: process.env.DB_NAME || 'collection',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'shin.1412', // local 12345678
        options: {
            dialect: process.env.DIALECT || 'postgres',
            host: process.env.HOST || 'localhost'
        }
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'
    },
    email: {
        account: process.env.EMAIL_ACCOUNT || 'seu_2010@outlook.com',
        password: process.env.EMAIL_PASSWORD || 'shin.1412',
        templateTypes: {
            register: 'register',
            reset: 'reset'

        }
    },

}