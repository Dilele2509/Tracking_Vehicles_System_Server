'use strict';

const express = require('express');
const { addLicenseController, updateLicenseController, deleteLicenseController } = require('../controllers/licenseController');

const router = express.Router();

router.post('/add', addLicenseController);
router.put('/update', updateLicenseController);
router.delete('/delete', deleteLicenseController); 

module.exports = { routes: router };