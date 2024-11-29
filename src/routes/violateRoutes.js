'use strict';

const express = require('express');
const { getDriverViolate, sendWarningViolate } = require('../controllers/violateController');

const router = express.Router();

router.post('/driver-violate', getDriverViolate)
router.post('/send-violate-mail', sendWarningViolate);

module.exports = { routes: router };