'use strict';

const express = require('express');
const { getStatisticDate, getStatisticMonth, getStatisticYear, getIncomeDriver, getCompanyIncome, getDriverIncome, getStatisticRate, getStatisticDriver } = require('../controllers/incomeController'); 

const router = express.Router();


router.post('/date-driver', getStatisticDate); 
router.post('/month-driver', getStatisticMonth); 
router.post('/year-driver', getStatisticYear); 
router.post('/driver-income', getIncomeDriver );
router.get('/company-income', getCompanyIncome);
router.get('/driver-income-total', getDriverIncome);
router.get('/statistic-rate', getStatisticRate);
router.get('/statistic-drive', getStatisticDriver);

module.exports = { routes: router };