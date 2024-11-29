'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');
const { addIncome } = require('../income/index.js');

const pool = mysql.createPool(config.sql);

const driverCompleted = async (userId) => {
    try {
        const sqlQueries = await loadSqlQueries('trip/sql');
        const [result] = await pool.query(sqlQueries.driverCompleted, [
            userId,
        ]);
        return result[0];
    } catch (error) {
        console.error('Error fetching driver trip:', error.message);
        throw new Error('Could not fetch driver trip');
    }
};

const driverCancelled = async (userId) => {
    try {
        const sqlQueries = await loadSqlQueries('trip/sql');
        const [result] = await pool.query(sqlQueries.driverCompleted, [
            userId,
        ]);
        return ({ cancelled_rate_percentage: 100 - result[0].success_rate_percentage })
    } catch (error) {
        console.error('Error fetching driver trip:', error.message);
        throw new Error('Could not fetch driver trip');
    }
};

const driverRated = async (userId) => {
    try {
        const sqlQueries = await loadSqlQueries('trip/sql');
        const [result] = await pool.query(sqlQueries.driverRated, [
            userId,
        ]);
        return result[0];
    } catch (error) {
        console.error('Error fetching driver trip:', error.message);
        throw new Error('Could not fetch driver trip');
    }
};

const completedTrip = async (tripId) => {
    try {
        const sqlQueries = await loadSqlQueries('trip/sql');
        const [result] = await pool.query(sqlQueries.completedTrip, [
            tripId,
        ]);
        return result[0];
    } catch (error) {
        console.error('Error fetching driver trip:', error.message);
        throw new Error('Could not fetch driver trip');
    }
};

const completedTripList = async (userID) => {
    try {
        const sqlQueries = await loadSqlQueries('trip/sql');
        const [result] = await pool.query(sqlQueries.completedTripList, [userID]);
        return result;
    } catch (error) {
        console.error('Error fetching completed trip list:', error.message);
        throw new Error('Could not fetch completed trip list:');
    }
};

const ongoingTripList = async (userID) => {
    try {
        const sqlQueries = await loadSqlQueries('trip/sql');
        const [result] = await pool.query(sqlQueries.ongoingTripList, [userID])
        return result[0];
    } catch (error) {
        console.error('Error fetching ongoing trip list:', error.message);
        throw new Error('Could not fetch ongoing trip list');
    }
};

const getTripInfo = async (tripId) => {
    try {
        const sqlQueries = await loadSqlQueries('trip/sql');
        const [result] = await pool.query(sqlQueries.getTripInfo, [tripId]);
        return result[0]
    } catch (error) {
        console.error('Error fetching trip:', error.message);
    }
}

const setComplete = async (tripInfo) => {
    try {
        // Get the current date and time
        const now = new Date();
        const time = now.toTimeString().split(' ')[0]; // Format as HH:mm:ss

        // Load SQL queries for updating the trip status
        const sqlQueries = await loadSqlQueries('trip/sql');

        // Update the status of the trip
        const [result] = await pool.query(sqlQueries.setComplete, [time, tripInfo.id]);

        // If the trip status is updated successfully, insert income
        if (result.affectedRows > 0) {
            const [addIncomeInto] = await addIncome(tripInfo);  // Assuming addIncome is defined elsewhere

            // Return success status and data
            return {
                status: 'success',
                tripUpdate: result,
                income: addIncomeInto
            };
        } else {
            throw new Error('Failed to update trip status');
        }
    } catch (error) {
        console.error('Error completing trip:', error.message);
        throw new Error('Could not complete the transaction');
    }
};

const allTrips = async()=>{
    try {
        const sqlQueries = await loadSqlQueries('trip/sql');
        const [result] = await pool.query(sqlQueries.allTrips);
        return result;
    } catch (error) {
        console.error('Error fetching all trips:', error.message);
        throw new Error('Could not fetch all trips');
    }
}

module.exports = {
    driverCompleted,
    driverCancelled,
    driverRated,
    completedTrip,
    completedTripList,
    ongoingTripList,
    setComplete,
    getTripInfo,
    allTrips,
};