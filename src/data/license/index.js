'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');

const pool = mysql.createPool(config.sql);


const addLicense = async (newID, data) => {
    try {
        const sqlQueries = await loadSqlQueries('license/sql');
        const result = await pool.query(sqlQueries.addLicense, [
            newID,
            data.license_identity,
            data.license_class,
            data.license_date,
            data.expiration_date
        ])
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to add license');
    }
};

// Function to generate the next license ID
const generateLicenseId = async () => {
    const query = 'SELECT MAX(id) AS maxId FROM licenses';
    const [result] = await pool.query(query);
    const maxId = result[0]?.maxId || 'DL000'; // Default if no licenses exist
    const nextIdNumber = parseInt(maxId.replace('DL', '')) + 1;
    return `DL${nextIdNumber.toString().padStart(3, '0')}`; // Format to DL001, DL002, etc.
};

module.exports = { 
    addLicense,
    generateLicenseId
};