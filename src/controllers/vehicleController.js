'use strict';

const { getVehicles,
    getVehicleById,
    getVehicleByUserID,
    getVehiclesByBrandName,
    searchVehicleData,
    getVehiclesByLicensePlate,
    updateVehicleStatus,
    addNewVehicle,
    generateVehicleId,
    updateVehicleInfo,
    deleteVehicle,
    updateVehicleImg } = require('../data/vehicle');

const getAllVehicle = async (req, res) => {
    try {
        const vehicleList = await getVehicles();
        res.send(vehicleList);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const searchVehicle = async (req, res, next) => {
    try {
        const title = req.body.title;
        const search = await searchVehicleData(title);
        /* console.log('search: ', search); */
        res.send(search);
    } catch (error) {
        res.status(400).send(error.message);
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

const getByDriverInput = async (req, res) => {
    try {
        const {userId} = req.body;
        /* console.log(userID); */
        const vehicles = await getVehicleByUserID(userId);
        console.log(vehicles);
        res.send(vehicles);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}


//get vehicle base on driver_id
const getByUserID = async (req, res) => {
    try {
        const userID = req.cookies.userId;
        /* console.log(userID); */
        const vehicles = await getVehicleByUserID(userID);
        console.log(vehicles);
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
        const id = req.body.id;
        console.log(id);
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
        const newId = await generateVehicleId();
        // Destructure the data from the request body
        const data = JSON.parse(req.body.data);
        const {device_id, vehicle_brand, vehicle_line, license_plate} = data;
        const thumbnail = req.file;

        // Check if the thumbnail file is uploaded
        if (!thumbnail) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Insert the vehicle data
        const insert = await addNewVehicle(newId, device_id, vehicle_brand, vehicle_line, license_plate);
        if (insert.status === 'success') {
            /* console.log('filePath: ' + filePath); */
            const result = await updateVehicleImg(newId, thumbnail.filename); // Use newId instead of id

            // Send the response
            const combineRes = {
                status: 200,
                message: "Added successfully",
                image: result,
                insert: insert.result // Return the insert result if needed
            };
            return res.send(combineRes);
        } else {
            return res.status(400).send(insert);
        }
    } catch (error) {
        console.error('Error in addVehicle:', error.message); // Log the error
        return res.status(500).json({ message: error.message });
    } 
};

const updateVehicleThumbnail = async (req, res) => {
    try {
        const { id } = req.body;
        const thumbnail = req.file;

        /* console.log(id, thumbnail.filename); */
        // Check if the thumbnail file is uploaded
        if (!thumbnail) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await updateVehicleImg(id, thumbnail.filename); 
        console.log(result);
        return res.send({
            status: 200,
            result: result
        });
    } catch (error) {
        console.error('Error in updateVehicleImg:', error.message); // Log the error
        throw new Error('Error updating vehicle image');
    }
}

const updateVehicle = async (req, res) => {
    try {
        const data = req.body;
        console.log('data: ',data);
        const result = await updateVehicleInfo(data);

        if (result.affectedRows === 0) {
            return res.status(404).send({ status: 'fail' });
        }

        res.send({ status: 200, update: result });
    } catch (error) {
        res.status(400).send({ status: 'fail', error: error.message });
    }
};

// Controller function to delete a vehicle
const deleteVehicleController = async (req, res) => {
    const { id } = req.body;

    try {
        await deleteVehicle(id);
        res.send({ message: 'Vehicle deleted successfully.' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

module.exports = {
    getAllVehicle,
    getByDriverInput,
    getById,
    searchVehicle,
    getByUserID,
    getByBrandName,
    getByLicensePlate,
    disableVehicle,
    enableVehicle,
    addVehicle,
    updateVehicle,
    updateVehicleThumbnail,  
    deleteVehicle: deleteVehicleController // Export the delete function
};