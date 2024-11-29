'use strict';

const express = require('express');
const { updateLicenseController, deleteLicenseController, getLicenseByUser, getByDriverInput } = require('../controllers/licenseController');


const router = express.Router();

router.post('/get-by-id', getByDriverInput)
router.post('/get-info', getLicenseByUser)
router.put('/update', updateLicenseController);
router.delete('/delete', deleteLicenseController); 

module.exports = { routes: router };