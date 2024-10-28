'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');

const pool = mysql.createPool(config.sql);

const getOwnerInfo = async (userId) => {
    const sqlQueries = await loadSqlQueries('owner/sql');
    const query = sqlQueries.getOwnerInfo;

    try {
        const [result] = await pool.execute(query, [userId]);
        //console.log('result: ', result[0]);
        return result[0]
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database query failed');
    }
}

const generateOwnerID = async () => {
    const sqlQueries = await loadSqlQueries('owner/sql');
    const [result] = await pool.query(sqlQueries.getLastOwnerID);
    const maxId = result[0]?.id || 'OWNER00'; 
    const nextIdNumber = parseInt(maxId.replace('OWNER', '')) + 1;
    return `OWNER${nextIdNumber.toString().padStart(3, '0')}`; 
};

module.exports = {
    getOwnerInfo,
    generateOwnerID
}