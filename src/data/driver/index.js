'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');
const { getOwnerInfo } = require('../owner/index.js');

const pool = mysql.createPool(config.sql);

const getDriverByOwnerId = async (userId) => {
    const ownerInfo = await getOwnerInfo(userId);
    const sqlQueries = await loadSqlQueries('driver/sql');
    const query = sqlQueries.getDriverRental;

    try {
        const [result] = await pool.execute(query, [ownerInfo.id]);
        return result
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database query failed');
    }

}

module.exports = {
    getDriverByOwnerId
}