'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');

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
        return ({ cancelled_rate_percentage: 100 - result[0].success_rate_percentage})
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

const completedTripList = async () => {
    try {
        const sqlQueries = await loadSqlQueries('trip/sql');
        const [result] = await pool.query(sqlQueries.completedTripList)
        return result;
    } catch (error) {
        console.error('Error fetching trip:', error.message);
        throw new Error('Could not fetch trip');
    }
};

const ongoingTripList = async () => {
    try {
        const sqlQueries = await loadSqlQueries('trip/sql');
        const [result] = await pool.query(sqlQueries.ongoingTripList)
        return result[0];
    } catch (error) {
        console.error('Error fetching trip:', error.message);
        throw new Error('Could not fetch trip');
    }
};

module.exports = {
    driverCompleted,
    driverCancelled,
    driverRated,
    completedTrip,
    completedTripList,
    ongoingTripList
};