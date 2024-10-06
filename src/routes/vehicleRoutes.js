'use strict';

const express = require('express');
const { getAllVehicle, getById } = require('../controllers/vehicleController');  //for admin

const router = express.Router();

router.get('/vehicles', getAllVehicle);
router.post('/vehicle-id', getById);

module.exports = { routes: router };
