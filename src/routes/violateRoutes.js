'use strict';

const express = require('express');
const { getDriverViolate, sendWarningViolate, getAllViolates } = require('../controllers/violateController');

const router = express.Router();

router.get('/get-all', getAllViolates)
router.post('/driver-violate', getDriverViolate)
router.post('/send-violate-mail', sendWarningViolate);

module.exports = { routes: router };