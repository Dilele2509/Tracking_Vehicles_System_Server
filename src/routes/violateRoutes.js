'use strict';

const express = require('express');
const { getDriverViolate, sendLetterMail } = require('../controllers/violateController');

const router = express.Router();

router.post('/driver-violate', getDriverViolate)
router.post('/send-violate-mail', sendLetterMail);

module.exports = { routes: router };