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

        return result; 
    } catch (error) {
        console.error('Database update error:', error); 
        throw new Error('Database update failed'); 
    }
};

// Function to check user password
const checkUserPassword = async (userId) => {
    const user = await findById(userId); 
    if (!user) {
        throw new Error('User not found'); 
    }
    return user.password; 
};

module.exports = { findById, updateUser, checkUserPassword }; 