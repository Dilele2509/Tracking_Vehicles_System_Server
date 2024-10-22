'use strict';

const express = require('express');
const { getInfoById, 
        updateUserInfo } = require('../controllers/userController'); 

const router = express.Router();


router.post('/get-info', getInfoById); 
router.put('/update-info', updateUserInfo); 

module.exports = { routes: router };