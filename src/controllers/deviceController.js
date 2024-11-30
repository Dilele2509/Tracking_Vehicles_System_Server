'use strict';

const { getDeviceById, addNewData, getDataLatest } = require('../data/device');


const getDataById = async (req, res) => {
    try {
        const device_id = req.body.device_id;
        const devices = await getDeviceById(device_id);
        //console.log(devices, data);
        res.send(devices);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getLastById = async (req, res) => {
    try {
        const device_id = req.body.device_id;
        const devices = await getDataLatest(device_id);
        //console.log(devices, data);
        res.send(devices);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addDataDevice = async (req, res) => {
    try {
        const data = req.body;
        if(data.latitude === 0 && data.longitude === 0){
            res.send("Please waiting for data, device has not ready yet!")
        }else{
            const result = await addNewData(data);
            res.send(result);
        }
    } catch (error) {
        console.error('Error in addDataDevice:', error.message); // Log the error
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDataById,
    addDataDevice,
    getLastById
};