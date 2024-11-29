'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { updateParkedAndKmPerDay } = require('../vehicle/index.js')
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

        // Convert to local date and time formats
        const date = now.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD (địa phương)
        const time = now.toLocaleTimeString('en-GB', { hour12: false }); // Format as HH:mm:ss (địa phương, 24 giờ)

        console.log('dateTime:', date, time);

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

        if (result[0].affectedRows) {
            // Broadcast the data to clients via WebSocket
            broadcast({ event: 'newData', data: addJson });

            const parkedTime = await calParkedTime(addJson)
            const kmPerDay = await calKmPerDay(addJson)

            console.log('parked time: ', parkedTime, ' km per day: ', kmPerDay);

            try {
                const updateVehicleInfo = await updateParkedAndKmPerDay(parkedTime, kmPerDay, addJson.device_id);
                return {
                    status: 'success', // Make sure status is a string
                    result: result,
                    updateVehicleInfo: updateVehicleInfo
                };
            } catch (error) {
                console.error('Error updating vehicle info:', error.message);
            }

        } else {
            throw new Error('Could not add data');
        }

    } catch (error) {
        console.error('Error adding new data:', error.message);
        throw new Error('Could not add data');
    }
};

const calParkedTime = async (data) => {
    try {
        const sqlQueries = await loadSqlQueries('device/sql');
        /* console.log('insert calParked data: ',data); */
        const [result] = await pool.query(sqlQueries.calParkedTime, [
            data.device_id,
            data.date
        ]);
        if (result.length > 0) {
            return result[0];
        } else {
            return {
                device_id: data.device_id,
                date: data.date,
                parked_time: '00:00:00',
            }
        }
    } catch (error) {
        console.error('Error calculating parked time:', error.message);
        throw new Error('Could not calculate parked time');
    }
}

const calKmPerDay = async (data) => {
    try {
        const sqlQueries = await loadSqlQueries('device/sql');
        /* console.log('insert calParked data: ', data); */
        const [result] = await pool.query(sqlQueries.calKmPerDay, [
            data.device_id,
            data.date
        ]);
        if (result.length > 0) {
            return result[0];
        } else {
            return {
                device_id: data.device_id,
                date: data.date,
                km_per_day: 0
            }
        }
    } catch (error) {
        console.error('Error calculating Km per day:', error.message);
        throw new Error('Could not calculate Km per day');
    }
}

module.exports = {
    getDeviceById,
    getDataLatest,
    generateDeviceId,
    addNewData,
    calParkedTime,
    calKmPerDay
};