'use strict';

const { addLicense, 
        generateLicenseId,
        updateLicense,
        deleteLicense } = require('../data/license');

const addLicenseController = async (req, res) => {

    try {
        const data = req.body;
        const newId = await generateLicenseId();

        const result = await addLicense(newId, data);
        res.send({ status: 'success', added: result });
    } catch (error) {
        return res.status(400).json({ status: 'fail' });
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
    updateLicenseController,
    deleteLicenseController,
};