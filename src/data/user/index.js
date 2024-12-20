'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');
const pool = mysql.createPool(config.sql);


const allDriver = async () => {
    const queries = await loadSqlQueries('user/sql');
    const query = queries.allDriver;

    try {
        const [result] = await pool.execute(query);
        return result
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database query failed');
    }
};

const allAdmin = async () => {
    const queries = await loadSqlQueries('user/sql');
    const query = queries.allAdmin;

    try {
        const [result] = await pool.execute(query);
        return result
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database query failed');
    }
};


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
        if(result[0].deleted === 0){
            return result[0]
        }else{
            return({ 
                status: 'Error',
                message: 'this account has been disabled'})
        }
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database query failed');
    }
};

const checkEmailExist = async (email) => {
    try {
        const sqlQueries = await loadSqlQueries('user/sql');
        const query = sqlQueries.checkEmailExist;
        const [result] = await pool.execute(query, [email]);
        return result[0].Result
    } catch (error) {
        return error.message;
    }
}

function formatDateForMySQL(isoDate) {
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
}

const updateUser = async (userId, data) => {
    const queries = await loadSqlQueries('user/sql');
    const query = queries.updateUserByID;
    const selectQuery = queries.getUserByID;
    /* console.log('data get in data layer:', data);
    //console.log(data.birthday, 'data type:', typeof(data.birthday)); */
    // Format the birthday
    const formatted = formatDateForMySQL(data.birthday); 
    //console.log('formatting: ' + formatted);
    //console.log("Current timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);


    try {
        // Execute the update query
        await pool.execute(query, [
            data.fullname,
            formatted,
            data.phone_number,
            data.email,
            userId
        ]);

        // Now select the updated user information
        const [selectResult] = await pool.execute(selectQuery, [userId]);

        //console.log('Updated user information:', selectResult[0]);
        return selectResult[0];
    } catch (error) {
        //console.error('Database update error:', error);
        throw new Error('Database update failed');
    }
};

const adminUpdate = async (data) => {
    const queries = await loadSqlQueries('user/sql');
    const query = queries.updateUserByID;
    const selectQuery = queries.getUserByID;

    const userData = data.userData;  // Access userData from the data object
    //console.log('Data being passed to query:', userData);

    // Validate data
    if (!userData.fullname || !userData.birthday || !userData.phone_number || !userData.email || !userData.id) {
        throw new Error('Missing required fields');
    }

    try {
        // Execute the update query
        await pool.execute(query, [
            userData.fullname || null,
            userData.birthday || null,
            userData.phone_number || null,
            userData.email || null,
            userData.id
        ]);

        // Now select the updated user information
        const [selectResult] = await pool.execute(selectQuery, [userData.id]);

        //console.log('Updated user information:', selectResult[0]);
        return selectResult[0];
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

const updateUserAva = async (id, avatar) => {
    try {
        const sqlQueries = await loadSqlQueries('user/sql');
        /* console.log('avatar:', avatar, 'userId:', id); */ // Log both values
        const update = await pool.execute(sqlQueries.updateUserAva, [avatar, id]);
        /* console.log("SQL Update Result:", update); */
        return update;
    } catch (error) {
        console.error("Error in updateUserAva:", error.message);
        throw error;
    }
};


const createUser = async (newId, data) => {
    const queries = await loadSqlQueries('user/sql');
    const query = queries.addUser;

    try {
        // Insert into the users table
        const [result] = await pool.execute(query, [
            newId,
            'ROLE002',
            data.fullname,
            data.birthday,
            data.phone_number,
            data.email,
            null,
            data.password,
            data.avatar || '/public/assets/Images/avatars/default_ava.png',
            data.deleted || 0 // Default deleted status
        ]);

        // Return a success response with user creation result
        return {
            status: true,
            message: 'User created successfully',
            data: result
        };
    } catch (error) {
        console.error('Database create user error:', error);
        throw new Error('Database create user failed');
    }
};

const addLicenseIdToUser = async (userId, licenseId)=>{
    const sqlQueries = await loadSqlQueries('user/sql');
    try {
        const [result] = await pool.query(sqlQueries.addLicenseId, [userId, licenseId]);
        return result;
    } catch (error) {
        console.error('Database add license error:', error);
        throw new Error('Database add license failed');
    }
}


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
    allDriver,
    allAdmin,
    findById,
    updateUserAva,
    updateUser,
    adminUpdate,
    checkUserPassword,
    updatePasswordByID,
    createUser,
    addLicenseIdToUser,
    generateUserID,
    deleteUser,
    updateUserStatus,
    getUserByEmail,
    checkEmailExist
};