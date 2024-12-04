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

const addIncome = async (data) => {
    try {
        /* console.log(data); */
        const sqlQueries = await loadSqlQueries('income/sql');
        const result = await pool.query(sqlQueries.addIncome, [
            data.driver_id,
            data.date,
            data.timeCompleted,
            data.id,
            0.3,
            (data.price * 0.3)
        ]);
        return result;
    } catch (error) {
        console.error('Error fetching driver income:', error.message);
        throw new Error('Could not fetch driver income');
    }
};

const companyIncome = async () => {
    try {
        /* console.log(data); */
        const sqlQueries = await loadSqlQueries('income/sql');
        const date = await pool.query(sqlQueries.companyIncomeDate);
        const month = await pool.query(sqlQueries.companyIncomeMonth);
        const year = await pool.query(sqlQueries.companyIncomeYear);

        return ({
            date: date[0],
            month: month[0],
            year: year[0]
        });
    } catch (error) {
        console.error('Error fetching company income:', error.message);
        throw new Error('Could not fetch company income');
    }
};

const driverIncome = async () => {
    try {
        /* console.log(data); */
        const sqlQueries = await loadSqlQueries('income/sql');
        const result = await pool.query(sqlQueries.driverIncome);

        return result[0];
    } catch (error) {
        console.error('Error fetching company income:', error.message);
        throw new Error('Could not fetch company income');
    }
};

const statisticRate = async () => {
    try {
        /* console.log(data); */
        const sqlQueries = await loadSqlQueries('income/sql');
        const result = await pool.query(sqlQueries.statisticRating);

        return result[0];
    } catch (error) {
        console.error('Error fetching company rating:', error.message);
        throw new Error('Could not fetch company rating');
    }
}

const statisticDriver = async () => {
    try {
        const sqlQueries = await loadSqlQueries('income/sql');
        const result = await pool.query(sqlQueries.statisticDriverInfo); // Array of driver details
        const statisticCompleted = await pool.query(sqlQueries.StaticCompleteTrip); // Array of completion rates

        // Merging the two arrays
        const mergedData = result[0].map((driver) => {
            // Find the matching completion rate data
            const completionData = statisticCompleted[0].find(
                (item) => item.driver_id === driver.driver_id
            );

            return {
                ...driver, // Spread driver details
                success_rate_percentage: completionData
                    ? completionData.success_rate_percentage
                    : null, // Add success rate or default to null
            };
        });

        console.log(mergedData);
        return mergedData;
    } catch (error) {
        console.error('Error fetching driver statistics:', error.message);
        throw new Error('Could not fetch driver statistics');
    }
};


module.exports = {
    statisticDate,
    statisticMonth,
    statisticYear,
    getIncomeID,
    addIncome,
    companyIncome,
    driverIncome,
    statisticRate,
    statisticDriver
};