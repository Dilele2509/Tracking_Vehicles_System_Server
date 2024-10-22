'use strict';

const { findById, updateUser } = require('../data/user'); 


const getInfoById = async (req, res) => {
    try {

        const userId = req.cookies.userId; 
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in cookies' });
        }
        const user = await findById(userId); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            id: userId,
            fullname: user.fullname,
            birthday: user.birthday,
            phone_number: user.phone_number,
            email: user.email,
        });
    } catch (error) {
        console.error('Error fetching user info:', error); 
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUserInfo = async (req, res) => {
    try {
        const userId = req.cookies.userId; 
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in cookies' });
        }

        const updatedData = req.body; 
        const updatedUser = await updateUser(userId, updatedData); 

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user info:', error); 
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { getInfoById, updateUserInfo }; 