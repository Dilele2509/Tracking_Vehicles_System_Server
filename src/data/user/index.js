'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');
const pool = mysql.createPool(config.sql); 

// Function to find a user by ID
const findById = async (userId) => {
    console.log('Finding user with ID:', userId);
    const queries = await loadSqlQueries('user/sql');
    const query = queries.getUserByID;
    console.log('query: ', query)
    
    try {
        const [rows] = await pool.execute(query, [userId]); 
        console.log('query result: ', rows)
        return rows
    } catch (error) {
        console.error('Database query error:', error); 
        throw new Error('Database query failed'); 
    }
};


module.exports = { findById };