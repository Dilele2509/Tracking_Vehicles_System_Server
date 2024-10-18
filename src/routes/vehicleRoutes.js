'use strict';

const express = require('express');
const { getAllVehicle, 
        getById, 
        getByUserID, 
        getByBrandName,
        getByLicensePlate,
        disableVehicle,
        enableVehicle,
        addVehicle,
        updateVehicle} = require('../controllers/vehicleController');

const router = express.Router();

router.get('/get-all', getAllVehicle);
router.post('/vehicle-id', getById);
router.post('/vehicles-user-id', getByUserID);
router.post('/vehicles-brand', getByBrandName);
router.post('/vehicles-license-plate', getByLicensePlate);
router.put('/vehicles/disable', disableVehicle); 
router.put('/vehicles/enable', enableVehicle);
router.post('/vehicles/add', addVehicle);
router.put('/vehicles/update', updateVehicle); 

module.exports = { routes: router };
