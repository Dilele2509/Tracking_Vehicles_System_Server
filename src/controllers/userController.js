'use strict';

const bcrypt = require('bcrypt');
const { findById, updateUser, checkUserPassword } = require('../data/user'); 


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



const checkPassword = async (req, res) => {
    try {
        const userId = req.cookies.userId; 
        const { password } = req.body; // Get the plain text password from the request body

        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in cookies' });
        }

        // Retrieve the stored hashed password for comparison
        const storedHashedPassword = await checkUserPassword(userId); 

        const hashedStoredPassword = await bcrypt.hash(storedHashedPassword, 10)

        // Log the passwords for debugging
        console.log("Plain text password:", password);
        console.log("Stored hashed password:", storedHashedPassword);

        // Compare the plain text password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, hashedStoredPassword); 
        console.log("Is password valid:", isPasswordValid); // Log the result of the comparison


        return res.status(200).json({ status: isPasswordValid });
    } catch (error) {
        console.error('Error checking password:', error); 
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { getInfoById, updateUserInfo, checkPassword }; 