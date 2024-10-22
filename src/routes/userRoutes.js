'use strict';

const express = require('express');
const { getInfoById } = require('../controllers/userController'); 

const router = express.Router();


router.post('/get-info', getInfoById); 

module.exports = { routes: router };