'use strict';

const express = require('express');
const { 
    getAllVehicle, 
    getById, 
    getByUserID, 
    getByBrandName,
    getByLicensePlate,
    disableVehicle,
    enableVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle // Import the delete function
} = require('../controllers/vehicleController');

const router = express.Router();

router.get('/get-all', getAllVehicle);
router.post('/id', getById);
router.post('/user-id', getByUserID);
router.post('/brand', getByBrandName);
router.post('/license-plate', getByLicensePlate);
router.put('/disable', disableVehicle); 
router.put('/enable', enableVehicle);
router.post('/add', addVehicle);
router.put('/update', updateVehicle);
router.delete('/delete', deleteVehicle); // Added route for deleting a vehicle

module.exports = { routes: router };