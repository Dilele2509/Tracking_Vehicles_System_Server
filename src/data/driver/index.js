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

const generateDriverID = async () => {
    const sqlQueries = await loadSqlQueries('driver/sql');
    const [result] = await pool.query(sqlQueries.getLastDriverID);
    const maxId = result[0]?.id || 'DRIVER00'; 
    const nextIdNumber = parseInt(maxId.replace('DRIVER', '')) + 1;
    return `DRIVER${nextIdNumber.toString().padStart(3, '0')}`; 
};

module.exports = {
    getDriverByOwnerId,
    generateDriverID
}