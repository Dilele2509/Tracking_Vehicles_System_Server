'use strict';

const express = require('express');
const { getInfoById, 
        updateUserInfo,
        checkPassword } = require('../controllers/userController'); 

const router = express.Router();


router.post('/get-info', getInfoById); 
router.put('/update-info', updateUserInfo); 
router.post('/check-password', checkPassword); 

module.exports = { routes: router };