'use strict';

const express = require('express');
const { getBalanceById } = require('../controllers/walletController'); 

const router = express.Router();


router.post('/get-balance', getBalanceById); 

module.exports = { routes: router };