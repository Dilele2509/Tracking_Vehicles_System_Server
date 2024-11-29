'use strict';

const express = require('express');
const { 
    getAllVehicle, 
    getById, 
    searchVehicle,
    getByUserID, 
    getByBrandName,
    getByLicensePlate,
    disableVehicle,
    enableVehicle,
    updateVehicle,
    deleteVehicle 
} = require('../controllers/vehicleController');

const router = express.Router();

router.get('/get-all', getAllVehicle);
router.post('/search', searchVehicle);
router.post('/id', getById);
router.post('/user-id', getByUserID);   
router.post('/brand', getByBrandName);
router.post('/license-plate', getByLicensePlate);
router.put('/disable', disableVehicle); 
router.put('/enable', enableVehicle);
router.put('/update', updateVehicle);
router.delete('/delete', deleteVehicle); 

module.exports = { routes: router };