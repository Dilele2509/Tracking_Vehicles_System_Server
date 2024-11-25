'use strict';

const express = require('express');
const { getStatisticDate, getStatisticMonth, getStatisticYear, getIncomeDriver } = require('../controllers/incomeController'); 

const router = express.Router();


router.post('/date-driver', getStatisticDate); 
router.post('/month-driver', getStatisticMonth); 
router.post('/year-driver', getStatisticYear); 
router.post('/driver-income', getIncomeDriver )

module.exports = { routes: router };