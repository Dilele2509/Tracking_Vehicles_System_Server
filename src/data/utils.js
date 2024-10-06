const fs = require('fs-extra');
const { join } = require('path');
const mysql = require('mysql2/promise');
const config = require('../../config.js');

const loadSqlQueries = async (folderName) => {
    const filePath = join(process.cwd(), 'src/data', folderName);
    const files = await fs.readdir(filePath);
    const sqlFiles = files.filter(f => f.endsWith('.sql'));
    const queries = {};
    for (const sqlfile of sqlFiles) {
        const query = await fs.readFile(join(filePath, sqlfile), { encoding: 'UTF-8' });
        queries[sqlfile.replace('.sql', '')] = query;
    }
    return queries;
};

// MySQL pool connection
const connectMySQL = async () => {
    return mysql.createPool({
        host: config.sql.host,
        user: config.sql.user,
        password: config.sql.password,
        database: config.sql.database,
        port: config.sql.port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
};

module.exports = { loadSqlQueries, connectMySQL };
