'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');
const pool = mysql.createPool(config.sql); 

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

const getUserByEmail = async (email) => {
    const queries = await loadSqlQueries('user/sql');
    const query = queries.getUserByEmail;
    
    try {
        const [result] = await pool.execute(query, [email]); 
        return result[0]
    } catch (error) {
        console.error('Database query error:', error); 
        throw new Error('Database query failed'); 
    }
};

const checkEmailExist = async(email) => {
    try {
        const sqlQueries = await loadSqlQueries('user/sql');
        const query = sqlQueries.checkEmailExist;  
       const [result] = await pool.execute(query, [email]); 
        return result[0].Result
    } catch (error) {
        return error.message;
    }
}

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

const checkUserPassword = async (userId) => {
    const user = await findById(userId); 
    if (!user) {
        throw new Error('User not found'); 
    }
    return user.password; 
};

const updatePasswordByID = async (userId, newPassword) => {
    const queries = await loadSqlQueries('user/sql');
    const query = queries.updateUserPasswordByID; 

    try {
        const [result] = await pool.execute(query, [newPassword, userId]); 
        return result; 
    } catch (error) {
        console.error('Database update password error:', error); 
        throw new Error('Database update password failed'); 
    }
};


const createUser = async (newId,data) => {
    const queries = await loadSqlQueries('user/sql');
    const query = queries.addUser; 

    try {
        const [result] = await pool.execute(query, [
            newId,
            data.role_id,
            data.fullname,
            data.birthday,
            data.phone_number,
            data.email,
            data.password,
            data.avatar || '/avatars/default_ava.png', 
            data.deleted || 0 // Default deleted status
        ]);
        return result;
    } catch (error) {
        console.error('Database create user error:', error);
        throw new Error('Database create user failed');
    }
};

const generateUserID = async () => {
    const sqlQueries = await loadSqlQueries('user/sql');
    const [result] = await pool.query(sqlQueries.getLastUserID);
    const maxId = result[0]?.id || 'USER00'; 
    const nextIdNumber = parseInt(maxId.replace('USER', '')) + 1;
    return `USER${nextIdNumber.toString().padStart(3, '0')}`; 
};


const deleteUser = async (id) => {
    try {
        const sqlQueries = await loadSqlQueries('user/sql');
        await pool.query(sqlQueries.deleteUser, [id]);
 
    } catch (error) {
        console.error('Error deleting user:', error.message);
        throw new Error('Could not delete user');
    }
};

const updateUserStatus = async (id, isDisable = true) => {
    try {
        const sqlQueries = await loadSqlQueries('user/sql');
        const query = isDisable 
            ? sqlQueries.disableStatus 
            : sqlQueries.enableStatus; 
        const result = await pool.query(query, [id]);
        return result;
    } catch (error) {
        console.error('Error updating user status:', error.message);
        throw new Error('Could not update user status');
    }
}



module.exports = { 
    findById, 
    updateUser, 
    checkUserPassword, 
    updatePasswordByID, 
    createUser, 
    generateUserID, 
    deleteUser, 
    updateUserStatus, 
    getUserByEmail, 
    checkEmailExist };