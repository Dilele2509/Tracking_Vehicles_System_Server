'use strict';

const express = require('express');
const { getInfoById, 
        updateUserInfo,
        checkPassword,
        updatePassword,
        addNewUser,
        deleteUserController,
        disableUser,
        enableUser } = require('../controllers/userController'); 
const { getDriverByOwner } = require('../controllers/ownerController');

const router = express.Router();


router.get('/get-info', getInfoById); 
router.put('/update-info', updateUserInfo); 
router.post('/check-password', checkPassword); 
router.put('/update-password', updatePassword);
router.post('/add-user', addNewUser);
router.delete('/delete', deleteUserController)
router.put('/disable', disableUser); 
router.put('/enable', enableUser);

//for owners
router.get('/get-driver', getDriverByOwner); 

module.exports = { routes: router };