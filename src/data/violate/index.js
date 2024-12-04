'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');

const pool = mysql.createPool(config.sql);

const allViolates = async () => {
    try {
        const sqlQueries = await loadSqlQueries('violate/sql');
        const [result] = await pool.query(sqlQueries.allViolates);
        return result;
    } catch (error) {
        console.error('Error fetching violates:', error.message);
        throw new Error('Could not fetch violates');
    }
};


const getViolateID = async (id) => {
    try {
        const sqlQueries = await loadSqlQueries('violate/sql');
        const [result] = await pool.query(sqlQueries.getViolateID, [
            id,
        ]);
        return result;
    } catch (error) {
        console.error('Error fetching driver violates:', error.message);
        throw new Error('Could not fetch driver violates');
    }
};

const addViolateInfo = async (userId) => {
    try {
        console.log('userId: ', userId);
        const sqlQueries = await loadSqlQueries('violate/sql');
        // Get the current date and time
        const now = new Date();

        // Convert to local date and time formats
        const date = now.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD (local)
        const time = now.toLocaleTimeString('en-GB', { hour12: false }); // Format as HH:mm:ss (24-hour format)

        console.log('dateTime:', date, time);
        const result = await pool.query(sqlQueries.addViolate, [
            userId,
            date,
            time,
            null,
            50000
        ]);
        //console.log('insertViolate: ', result[0].insertId);
        return ({
            status: 200,
            message: 'Driver violate added successfully',
            data: {
                insertId: result[0].insertId
            }
        });
    } catch (error) {
        console.error('Error adding driver violate:', error.message);
        throw new Error('Could not add driver violate');
    }
}

const updateViolateImg = async (id, information) => {
    try {
        const sqlQueries = await loadSqlQueries('violate/sql');
        console.log('information:', information, 'id:', id);
        const update = await pool.execute(sqlQueries.updateViolateImg, [information, id]);
        console.log("SQL Update Result:", update);
        return update;
    } catch (error) {
        console.error("Error in update information violate:", error.message);
        throw error;
    }
}

module.exports = {
    allViolates,
    getViolateID,
    addViolateInfo,
    updateViolateImg
};