'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');

const pool = mysql.createPool(config.sql);

const getVehicles = async () => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        const [vehicleList] = await pool.query(sqlQueries.vehicleList);
        return vehicleList;
    } catch (error) {
        console.error('Error fetching vehicles:', error.message);
        throw new Error('Could not fetch vehicles');
    }
};

const getVehicleById = async (id) => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        const [vehicle] = await pool.query(sqlQueries.vehicleID, [id]);
        return vehicle;
    } catch (error) {
        console.error('Error fetching vehicle by ID:', error.message);
        throw new Error('Could not fetch vehicle');
    }
};


module.exports = { getVehicles, getVehicleById };
