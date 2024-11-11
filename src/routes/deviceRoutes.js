'use strict';

const express = require('express');
const { getDataById, addDataDevice, getLastById } = require('../controllers/deviceController');


const router = express.Router();

router.post('/get-data', getDataById),
router.post('/add-data', addDataDevice)
router.post('/get-latest', getLastById)


module.exports = { routes: router };