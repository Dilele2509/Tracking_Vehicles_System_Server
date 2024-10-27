'use strict';

const {getDriverByOwnerId} = require('../data/driver');

const getDriverByOwner = async (req, res)=>{
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.status(401).json({ message: 'User ID not found in cookies' });
        }
        const driver = await getDriverByOwnerId(userId);
        if (!driver) {
            return res.status(404).json({ message: 'No driver found for this owner' });
        }
        res.send(driver);
    } catch (error) {
        console.error('Error fetching driver info:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    getDriverByOwner
};