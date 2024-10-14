'use strict';

const { getVehicles, 
    getVehicleById, 
    getVehicleByUserID, 
    getVehiclesByBrandName, 
    getVehiclesByLicensePlate, 
    updateVehicleStatus,
    addNewVehicle,    
    generateVehicleId } = require('../data/vehicle');

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


//get vehicle base on driver_id
const getByUserID = async (req, res) => {
    try {
        const userID = req.body.userID;
        const vehicles = await getVehicleByUserID(userID);
        res.send(vehicles);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const getByBrandName = async (req, res) => {
    try {
        const brandName = req.body.brandName; 
        const vehicles = await getVehiclesByBrandName(brandName); 
        res.send(vehicles); 
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const getByLicensePlate = async (req, res) => {
    try {
        const licensePlate = req.body.licensePlate; 
        const vehicles = await getVehiclesByLicensePlate(licensePlate); 
        res.send(vehicles); 
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const disableVehicle = async (req, res) => {
    try {
        const id = req.body.id; // Ensure the ID is being sent in the request body
        const result = await updateVehicleStatus(id);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Vehicle not found or already deleted.' });
        }
        res.send({ message: 'Vehicle disabled successfully.' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const enableVehicle = async (req, res) => {
    try {
        const id = req.body.id; 
        const result = await updateVehicleStatus(id, false); 
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Vehicle not found or not deleted.' });
        }
        res.send({ message: 'Vehicle enabled successfully.' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const addVehicle = async (req, res) => {
    try {
        const data = req.body;
        const owner_id = "OWNER001"; // hông biết xử lý chỗ này bé ơiii =)))
        const thumbnail = '/public/assets/Images/default.jpg'; // Default thumbnail path

        // Generate the new vehicle ID
        const newId = await generateVehicleId();

        // const newVehicle = {
        //     id: newId,
        //     device_id,
        //     owner_id,
        //     driver_id: null,
        //     vehicle_brand,
        //     vehicle_line,
        //     thumbnail,
        //     license_plate,
        //     location: null,
        //     status,
        //     parked_time: null,
        //     km_per_day: null,
        //     deleted
        // };

        const result = await addNewVehicle(data);
        res.send({ status: 'success', added: result });

        console.log(newId);
        console.log("kkk")
    } catch (error) {
        res.status(400).send({ status: 'fail', error: error.message });
    }
};



module.exports = { 
    getAllVehicle, 
    getById, 
    getByUserID, 
    getByBrandName, 
    getByLicensePlate,
    disableVehicle,
    enableVehicle,
    addVehicle 
};
