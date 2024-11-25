'use strict';

const { addLicense,
    generateLicenseId,
    updateLicense,
    deleteLicense,
    getLicenseInfo, 
    addLicensePhoto} = require('../data/license');

const addLicenseController = async (req, res) => {

    try {
        const data = req.body;
        const newId = await generateLicenseId();

        const photo = req.file;
        if (!photo) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Insert the vehicle data
        const result = await addLicense(newId, photo, data);
        if (result.status === 'success') {
            const filePath = '/public/assets/Images/IDCardPhoto/' + photo.filename;
            const addPhoto = await addLicensePhoto(newId, filePath);

            // Send the response
            const combineRes = {
                status: 200,
                message: "Added successfully",
                image: addPhoto,
                insert: result.result // Return the insert result if needed
            };
            return res.send(combineRes);
        } else {
            return res.status(400).json({ status: 'fail' });
        }
    } catch (error) {
        return res.status(400).json({ status: 'fail' });
    }
};

const updateLicensePhoto = async (req, res) => {
    const {licenseId} = req.body;
    const photo = req.file;

    if (!photo) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const filePath = '/public/assets/Images/IDCardPhoto/' + photo.filename;
        const result = await addLicensePhoto(licenseId, filePath);
        res.send({ status: 'success', updated: result });
    } catch (error) {
        return res.status(400).json({ status: 'fail', message: error.message });
    }
};

const getLicenseByUser = async (req, res) => {
    const userId = req.cookies.userId;

    try {
        const result = await getLicenseInfo(userId);
        res.send({ status: 'success', license: result[0] });
    } catch (error) {
        return res.status(400).json({ status: 'fail', message: error.message });
    }
};


// Controller function to update a license
const updateLicenseController = async (req, res) => {
    const { id, license_identity, license_class, license_date, expiration_date } = req.body;

    try {
        const result = await updateLicense(id, {
            license_identity,
            license_class,
            license_date,
            expiration_date
        });
        res.send({ status: 'success', updated: result });
    } catch (error) {
        return res.status(400).json({ status: 'fail', message: error.message });
    }
};



// Controller function to delete a license
const deleteLicenseController = async (req, res) => {
    const { id } = req.body;

    try {
        await deleteLicense(id);
        res.send({ status: 'success', message: 'Deleted successfully' });
    } catch (error) {
        return res.status(400).json({ status: 'fail', message: error.message });
    }
};

module.exports = {
    addLicenseController,
    updateLicensePhoto,
    getLicenseByUser,
    updateLicenseController,
    deleteLicenseController,
};