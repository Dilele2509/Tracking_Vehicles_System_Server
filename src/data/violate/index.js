'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');

const pool = mysql.createPool(config.sql);

const getViolateID = async (userId) => {
    try {
        const sqlQueries = await loadSqlQueries('violate/sql');
        const [result] = await pool.query(sqlQueries.getViolateID, [
            userId,
        ]);
        return result;
    } catch (error) {
        console.error('Error fetching driver violates:', error.message);
        throw new Error('Could not fetch driver violates');
    }
};

module.exports = {
    getViolateID
};