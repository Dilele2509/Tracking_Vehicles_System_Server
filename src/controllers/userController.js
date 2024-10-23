'use strict';

const bcrypt = require('bcrypt');
const { findById, updateUser, checkUserPassword, updatePasswordByID, createUser, generateUserID, deleteUser, updateUserStatus } = require('../data/user'); 


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
        const { password } = req.body; 

        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in cookies' });
        }
        const storedPassword = await checkUserPassword(userId); 

        // const hashedStoredPassword = await bcrypt.hash(storedHashedPassword, 10)

        const isPasswordValid = (password === storedPassword); 
        //    const isPasswordValid = await bcrypt.compare(password, hashedStoredPassword); 

        return res.status(200).json({ status: isPasswordValid });
    } catch (error) {
        console.error('Error checking password:', error); 
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const updatePassword = async (req, res) => {
    try {
        const userId = req.cookies.userId; 
        const { newPassword } = req.body; 
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in cookies' });
        }

        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await updatePasswordByID(userId, newPassword ); 

        return res.status(200).json({ status: result.affectedRows > 0 }); 
    } catch (error) {
        console.error('Error updating password:', error); 
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const addNewUser = async (req, res) => {
    try {
        const data = req.body;

        if (!data.role_id || !data.fullname || !data.email || !data.password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newId = await generateUserID();
        // Create the user
        const result = await createUser(newId, data);

        return res.status(201).json({ status: 'User created', added: result});
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteUserController = async (req, res) => {
    const { id } = req.body;

    try {
        await deleteUser(id);
        res.send({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};


const disableUser = async (req, res) => {
    try {
        const id = req.body.id; 
        const result = await updateUserStatus(id);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'User not found or already deleted.' });
        }
        res.send({ message: 'User disabled successfully.' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const enableUser = async (req, res) => {
    try {
        const id = req.body.id; 
        const result = await updateUserStatus(id, false); 
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'User not found or not deleted.' });
        }
        res.send({ message: 'User enabled successfully.' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}


module.exports = { getInfoById, updateUserInfo, checkPassword, updatePassword, addNewUser, deleteUserController, disableUser, enableUser };

