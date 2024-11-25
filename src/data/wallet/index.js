'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');

const pool = mysql.createPool(config.sql);

const getBalance = async (userId) => {
    try {
        const sqlQueries = await loadSqlQueries('wallet/sql');
        const [balance] = await pool.query(sqlQueries.getBalance, [userId]);
        return balance[0];
    } catch (error) {
        console.error('Error fetching balance:', error.message);
        throw new Error('Could not fetch balance');
    }
};

module.exports = { 
    getBalance, 
};