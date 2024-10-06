'use strict';

const { getVehicles, getVehicleById } = require('../data/vehicle');

const getAllVehicle = async (req, res) => {
    try {
        const vehicleList = await getVehicles();
        res.send(vehicleList);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const getById = async (req, res) => {
    try {
        const id = req.body.id;
        const vehicle = await getVehicleById(id);
        //console.log(vehicle, data);
        res.send(vehicle);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = { getAllVehicle, getById };
