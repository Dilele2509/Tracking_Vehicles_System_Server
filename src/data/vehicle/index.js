'use strict';

const mysql = require('mysql2/promise');
const config = require('../../../config.js');
const { loadSqlQueries } = require('../utils.js');

const pool = mysql.createPool(config.sql);

const getVehicles = async () => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        const [vehicleList] = await pool.query(sqlQueries.vehicleList);
        return vehicleList;
    } catch (error) {
        console.error('Error fetching vehicles:', error.message);
        throw new Error('Could not fetch vehicles');
    }
};

const getVehicleById = async (id) => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        const [vehicle] = await pool.query(sqlQueries.vehicleID, [id]);
        return vehicle;
    } catch (error) {
        console.error('Error fetching vehicle by ID:', error.message);
        throw new Error('Could not fetch vehicle');
    }
};

const searchVehicleData = async (title) => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        const searchTerm = `%${title}%`;
        const [result] = await pool.query(sqlQueries.searchVehicle, [searchTerm, searchTerm]);
        return result;
    } catch (error) {
        return error.message;
    }
}

const getVehicleByUserID = async (driverId) => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        const [vehicle] = await pool.query(sqlQueries.vehicleUserID, [driverId]);
        /* console.log(vehicle[0]); */
        return vehicle[0];
    } catch (error) {
        console.error('Error fetching vehicle by ID:', error.message);
        throw new Error('Could not fetch vehicle');
    }
};


const getVehiclesByBrandName = async (brandName) => {
    try {
    const sqlQueries = await loadSqlQueries('vehicle/sql');
    const [vehicle] = await pool.query(sqlQueries.vehicleBrandName, [brandName]);
    return vehicle; 

    } catch (error){
        console.error('Error fetching vehicle by ID:', error.message);
        throw new Error('Could not fetch vehicle');
    }
};

const getVehiclesByLicensePlate = async (licensePlate) => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        const [vehicle] = await pool.query(sqlQueries.vehicleLicense, [licensePlate]);
        return vehicle; 
    } catch (error) {
        console.error('Error fetching vehicles by license plate:', error.message);
        throw new Error('Could not fetch vehicles');
    }
};


const updateVehicleStatus = async (id, isDisable = true) => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        const query = isDisable 
            ? sqlQueries.disableStatus 
            : sqlQueries.enableStatus; 
        const result = await pool.query(query, [id]);
        return result;
    } catch (error) {
        console.error('Error updating vehicle status:', error.message);
        throw new Error('Could not update vehicle status');
    }
}


const addNewVehicle = async (newId, device_id, vehicle_brand, vehicle_line, license_plate) => {
    try {
        //console.log('newid: ' + newId, device_id, vehicle_brand, vehicle_line, license_plate);
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        const result = await pool.query(sqlQueries.addVehicle, [ 
            newId,          // id
            device_id,     // device_id
            null,       // user_id
            vehicle_brand, // vehicle_brand
            vehicle_line,  // vehicle_line
            license_plate, // license_plate
        ]);
        return {
            status: 'success', // Make sure status is a string
            result: result
        }; 
    } catch (error) {
        console.error('Error adding new vehicle:', error.message);
        throw new Error('Could not add vehicle');
    }
};

const updateParkedAndKmPerDay = async (parked_time, km_per_day, device_id) => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        const time = parked_time.parked_time.toString()
        //console.log('data in insert: ', parked_time.parked_time.toString(), km_per_day.km_per_day);
        const update = await pool.execute(sqlQueries.updateParkedAndKmPerDay, [
            time, 
            km_per_day.km_per_day,
            device_id
        ]);
        //console.log("SQL Update Result:", update);
        return update;
    } catch (error) {
        console.error("Error in update parked time and km per day:", error.message);
        throw error;
    }
}


const updateVehicleImg = async (id, thumbnail) => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        //console.log('thumbnail:', thumbnail, 'userId:', id); 
        const filePath = '/public/assets/Images/vehicles/' + thumbnail;
        //console.log('filePath:', filePath);
        const update = await pool.execute(sqlQueries.updateVehicleImg, [filePath, id]);
        //console.log("SQL Update Result:", update);
        return update;
    } catch (error) {
        console.error("Error in update thumbnail vehicle:", error.message);
        throw error;
    }
}

// Function to generate the next vehicle ID
const generateVehicleId = async () => {
    const sqlQueries = await loadSqlQueries('vehicle/sql');
    const [result] = await pool.query(sqlQueries.getMaxVehicleId);
    const maxId = result[0]?.id || 'VEH000'; 
    const nextIdNumber = parseInt(maxId.replace('VEH', '')) + 1;
    return `VEH${nextIdNumber.toString().padStart(3, '0')}`; 
};

const updateVehicleInfo = async (data) => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        //console.log(data);
        /* const locationWKT = `POINT(${data.location.longitude} ${data.location.latitude})`; */
        const result = await pool.query(sqlQueries.updateVehicle, [ 
            data.device_id,
            data.user_id,
            data.vehicle_brand,
            data.vehicle_line,
            data.license_plate,
            data.id 
        ]);
        return result; 
    } catch (error) {
        console.error('Error updating vehicle:', error.message);
        throw new Error('Could not update vehicle');
    }
};

// Function to delete a vehicle
const deleteVehicle = async (id) => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        await pool.query(sqlQueries.deleteVehicle, [id]);
        // No output is needed, just a successful deletion
    } catch (error) {
        console.error('Error deleting vehicle:', error.message);
        throw new Error('Could not delete vehicle');
    }
};

module.exports = { 
    getVehicles, 
    getVehicleById, 
    searchVehicleData,
    updateVehicleImg,
    getVehicleByUserID, 
    getVehiclesByBrandName, 
    getVehiclesByLicensePlate,
    updateVehicleStatus,
    addNewVehicle,
    generateVehicleId,
    updateVehicleInfo,
    deleteVehicle,
    updateParkedAndKmPerDay
};