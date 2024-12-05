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
            null,
            data.license_class,
            data.license_date,
            data.expiration_date
        ])
        return {
            status: 'success', // Make sure status is a string
            result: result
        }; 
    } catch (error) {
        console.error(error);
        throw new Error('Failed to add license');
    }
};

const addLicensePhoto = async (license_id, photo) =>{
    try {
        const sqlQueries = await loadSqlQueries('license/sql');
        //console.log('photo:', photo, 'license_id:', license_id); 
        const update = await pool.execute(sqlQueries.updatelicenseImg, [photo, license_id]);
        //console.log("SQL Update Result:", update);
        return update;
    } catch (error) {
        console.error("Error in update photo license:", error.message);
        throw error;
    }
};

const getLicenseInfo = async (userId) =>{
    const sqlQueries = await loadSqlQueries('license/sql');

    try {
        const result = await pool.query(sqlQueries.getLicenseInfo, [userId]);
        return result[0];
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch license info');
    }
};


const generateLicenseId = async () => {
    const query = 'SELECT MAX(id) AS maxId FROM driving_license';
    const [result] = await pool.query(query);
    const maxId = result[0]?.maxId || 'DL000';
    const nextIdNumber = parseInt(maxId.replace('DL', '')) + 1;
    return `DL${nextIdNumber.toString().padStart(3, '0')}`; 
};


const updateLicense = async (id, data) => {
    try {
        const sqlQueries = await loadSqlQueries('license/sql');
        const result = await pool.query(sqlQueries.updateLicense, [
            data.license_identity,
            data.license_class,
            data.license_date,
            data.expiration_date,
            id
        ]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to update license');
    }
};

const deleteLicense = async (id) => {
    try {
        const sqlQueries = await loadSqlQueries('license/sql');
        await pool.query(sqlQueries.deleteLicense, [id]);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to delete license');
    }
};


module.exports = { 
    addLicense,
    getLicenseInfo,
    addLicensePhoto,  
    generateLicenseId,
    updateLicense,
    deleteLicense
};