'use strict';

const express = require('express');
const { addLicenseController } = require('../controllers/licenseController');

const router = express.Router();

router.post('/licenses/add', addLicenseController);

module.exports = { routes: router };