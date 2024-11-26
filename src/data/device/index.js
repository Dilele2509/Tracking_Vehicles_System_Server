'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');
const { broadcast } = require('../../services/websocketService.js')

const pool = mysql.createPool(config.sql);


const getDeviceById = async (deviceId) => {
    try {
        const sqlQueries = await loadSqlQueries('device/sql');
        const [deviceData] = await pool.query(sqlQueries.deviceID, [deviceId]);
        return deviceData;
    } catch (error) {
        console.error('Error fetching data by ID:', error.message);
        throw new Error('Could not fetch data');
    }
};

const getDataLatest = async (deviceId) => {
    try {
        const sqlQueries = await loadSqlQueries('device/sql');
        const [deviceData] = await pool.query(sqlQueries.getDataLatest, [deviceId]);
        return deviceData[0];
    } catch (error) {
        console.error('Error fetching data by ID:', error.message);
        throw new Error('Could not fetch data');
    }
};

// Function to generate the next data ID
const generateDeviceId = async () => {
    const sqlQueries = await loadSqlQueries('device/sql');
    const [result] = await pool.query(sqlQueries.getMaxDeviceId);
    const maxId = result[0]?.device_id || 'DEV000';
    const nextIdNumber = parseInt(maxId.replace('DEV', '')) + 1;
    return `DEV${nextIdNumber.toString().padStart(3, '0')}`;
};

const addNewData = async (data) => {
    try {
        const sqlQueries = await loadSqlQueries('device/sql');
        console.log('data: ', data);
        console.log('sqlQueries: ', sqlQueries.addDataDevice);

        // Get the current date and time
        const now = new Date();

        // Convert to string formats
        const date = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const time = now.toTimeString().split(' ')[0]; // Format as HH:mm:ss

        // Prepare data for insertion
        const addJson = {
            device_id: data.device_id,
            latitude: data.latitude,
            longitude: data.longitude,
            date: date,
            time: time,
            RSSI: data.RSSI,
            speed: data.speed,
        }

        // Ensure that the query has placeholders for all the values
        const result = await pool.query(sqlQueries.addDataDevice, [
            addJson.device_id,
            addJson.latitude,
            addJson.longitude,
            addJson.date,
            addJson.time,
            addJson.RSSI,
            addJson.speed
        ]);

        // Broadcast the data to clients via WebSocket
        broadcast({ event: 'newData', data: addJson });

        return {
            status: 'success', // Make sure status is a string
            result: result
        };
    } catch (error) {
        console.error('Error adding new data:', error.message);
        throw new Error('Could not add data');
    }
};

module.exports = {
    getDeviceById,
    getDataLatest,
    generateDeviceId,
    addNewData
};