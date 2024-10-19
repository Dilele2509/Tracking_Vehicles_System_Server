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

const getVehicleByUserID = async (userID) => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        const [vehicle] = await pool.query(sqlQueries.vehicleUserID, [userID]);
        return vehicle;
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


const addNewVehicle = async (newId,data) => {
    try {
        const sqlQueries = await loadSqlQueries('vehicle/sql');
        const result = await pool.query(sqlQueries.addVehicle, [ 
            newId,
            data.device_id,
            data.owner_id,
            data.driver_id,
            data.vehicle_brand,
            data.vehicle_line,
            data.thumbnail,
            data.license_plate,
            data.location,
            data.status,
            data.parked_time,
            data.km_per_day,
            data.deleted
        ]);
        return result; 
    } catch (error) {
        console.error('Error adding new vehicle:', error.message);
        throw new Error('Could not add vehicle');
    }
};

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
        const locationWKT = `POINT(${data.location.longitude} ${data.location.latitude})`; // Adjust based on your data structure
        const result = await pool.query(sqlQueries.updateVehicle, [ 
            data.device_id,
            data.owner_id,
            data.driver_id,
            data.vehicle_brand,
            data.vehicle_line,
            data.thumbnail,
            data.license_plate,
            locationWKT, 
            data.status,
            data.parked_time,
            data.km_per_day,
            data.deleted,
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
    getVehicleByUserID, 
    getVehiclesByBrandName, 
    getVehiclesByLicensePlate,
    updateVehicleStatus,
    addNewVehicle,
    generateVehicleId,
    updateVehicleInfo,
    deleteVehicle // Export the delete function
};