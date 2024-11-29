'use strict';

const express = require('express');
const { getAllDriver,
        getAllAdmin,
        getInfoById, 
        updateUserInfo,
        checkPassword,
        updatePassword,
        addNewUser,
        deleteUserController,
        disableUser,
        enableUser, 
        addLicenseId} = require('../controllers/userController'); 

const router = express.Router();

router.get('/get-all', getAllDriver);
router.get('/get-all-admin', getAllAdmin);
router.get('/get-info', getInfoById); 
router.put('/update-info', updateUserInfo); 
router.post('/check-password', checkPassword); 
router.put('/update-password', updatePassword);
router.post('/add-user', addNewUser);
router.put('/update-license', addLicenseId);
router.delete('/delete', deleteUserController)
router.put('/disable', disableUser); 
router.put('/enable', enableUser);

module.exports = { routes: router };