'use strict';

const { addLicense, generateLicenseId } = require('../data/license');

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

module.exports = { 
    addLicenseController,
};