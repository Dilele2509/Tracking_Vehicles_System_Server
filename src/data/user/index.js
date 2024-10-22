'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');
const pool = mysql.createPool(config.sql); 

// Function to find a user by ID
const findById = async (userId) => {
    const queries = await loadSqlQueries('user/sql');
    const query = queries.getUserByID;
    
    try {
        const [result] = await pool.execute(query, [userId]); 
        return result[0]
    } catch (error) {
        console.error('Database query error:', error); 
        throw new Error('Database query failed'); 
    }
};

// Function to update a user by ID
const updateUser = async (userId, data) => {
    const queries = await loadSqlQueries('user/sql');
    const query = queries.updateUserByID; 

    try {
        console.log('data: ', data)
        const [result] = await pool.execute(query, [userId,
                                                    data.fullname,
                                                    data.birthday,
                                                    data.phone_number,
                                                    data.email]); 

        return result[0]; 
    } catch (error) {
        console.error('Database update error:', error); 
        throw new Error('Database update failed'); 
    }
};

module.exports = { findById, updateUser }; 