'use strict';

const express = require('express');
const { updateLicenseController, deleteLicenseController, getLicenseByUser } = require('../controllers/licenseController');

const router = express.Router();

router.post('/get-info', getLicenseByUser)
router.put('/update', updateLicenseController);
router.delete('/delete', deleteLicenseController); 

module.exports = { routes: router };