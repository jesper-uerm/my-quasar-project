const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use true for Azure, often false for local dev
        trustServerCertificate: true // Helps with local self-signed certs
    }
};

const connectDB = async () => {
    try {
        await sql.connect(dbConfig);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('Database Connection Failed:', err);
        process.exit(1);
    }
};

module.exports = { connectDB, sql };