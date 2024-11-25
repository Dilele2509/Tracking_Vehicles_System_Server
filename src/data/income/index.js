'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');

const pool = mysql.createPool(config.sql);

const statisticDate = async (userId, date) => {
    try {
        /* console.log('userId', userId, ' date', date); */
        const sqlQueries = await loadSqlQueries('income/sql');
        const [result] = await pool.query(sqlQueries.statisticDateID, [
            userId,
            date,
            userId,
            date,
            userId,
            date
        ]);
        return result[0];
    } catch (error) {
        console.error('Error fetching statistic date:', error.message);
        throw new Error('Could not fetch statistic date');
    }
};

const statisticMonth = async (userId, year, month) => {
    try {
        const sqlQueries = await loadSqlQueries('income/sql');
        const [result] = await pool.query(sqlQueries.statisticMonthID, [
            userId,
            year,
            month,
            userId,
            year,
            month,
            userId,
            year,
            month
        ]);
        return result[0];
    } catch (error) {
        console.error('Error fetching statistic month:', error.message);
        throw new Error('Could not fetch statistic month');
    }
};

const statisticYear = async (userId, year) => {
    try {
        const sqlQueries = await loadSqlQueries('income/sql');
        const [result] = await pool.query(sqlQueries.statisticYearID, [
            userId,
            year,
            userId,
            year,
            userId,
            year
        ]);
        return result[0];
    } catch (error) {
        console.error('Error fetching statistic year:', error.message);
        throw new Error('Could not fetch statistic year');
    }
};

const getIncomeID = async (userId) => {
    try {
        const sqlQueries = await loadSqlQueries('income/sql');
        const result = await pool.query(sqlQueries.getIncomeID, [
            userId,
        ]);
        return result;
    } catch (error) {
        console.error('Error fetching driver income:', error.message);
        throw new Error('Could not fetch driver income');
    }
};

module.exports = { 
    statisticDate, 
    statisticMonth,
    statisticYear,
    getIncomeID
};