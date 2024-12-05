'use strict';
// const bcrypt = require('bcrypt');
const {
    allDriver,
    allAdmin,
    findById,
    updateUser,
    updateUserAva,
    checkUserPassword,
    updatePasswordByID,
    createUser,
    addLicenseIdToUser,
    generateUserID,
    deleteUser,
    updateUserStatus, 
    adminUpdate} = require('../data/user');

const getAllDriver = async (req, res) => {
    try {
        const user = await allDriver();
        if (!user) {
            return res.status(404).json({ message: 'can not get all users' });
        }

        return res.send(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserID = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await findById(userId);
        return res.send(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllAdmin = async (req, res) => {
    try {
        const user = await allAdmin();
        if (!user) {
            return res.status(404).json({ message: 'can not get all admin' });
        }

        return res.send(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

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
            license_id: user.license_id,
            avatar: user.avatar,
            deleted: user.deleted
        });
    } catch (error) {
        console.error('Error fetching user info:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const updateUserInfo = async (req, res) => {
    try {
        const updatedData = req.body;
        //console.log(updatedData);
        const userId = req.cookies.userId;
        //console.log('userid: ',userId);
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in cookies' });
        }
        const updatedUser = await updateUser(userId, updatedData);

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user info:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const adminUpdateUser = async (req, res) => {
    try {
        const data = req.body;
        const updatedUser = await adminUpdate(data);

        //console.log('result updated: ', updatedUser);
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user info:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const uploadAvatar = async (req, res, next) => {
    try {
        const userId = req.cookies.userId;

        // Log the userId to verify it is correctly received
        /* console.log("Received userId:", userId); */

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!req.file) {
            /* console.log("No file uploaded"); */
            return res.status(400).json({ message: 'No file uploaded' });
        }

        /* console.log('File uploaded: ', req.file); */

        const filePath = '/public/assets/Images/avatars/' + req.file.filename;
        //console.log("File path:", filePath);

        const result = await updateUserAva(userId, filePath);
        /* console.log("Database update result:", result); */

        res.status(200).json({ message: 'Avatar uploaded successfully', user: result });
    } catch (error) {
        console.error("Error in uploadAvatar:", error);
        res.status(500).json({ message: 'An error occurred' });
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
        const result = await updatePasswordByID(userId, newPassword);

        return res.status(200).json({ status: result.affectedRows > 0 });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const addNewUser = async (req, res) => {
    try {
        const data = req.body;
        //console.log(data);

        if (!data.fullname || !data.email || !data.birthday || !data.password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const newId = await generateUserID();

        // Create the user
        const result = await createUser(newId, data);

        return res.status(201).json({ status: 'User created', added: result });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addLicenseId = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const { licenseId } = req.body;
        if (!userId || !licenseId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const result = await addLicenseIdToUser(userId, licenseId);

        return res.status(200).json({ status: result.affectedRows > 0 });
    } catch (error) {
        console.error('Error adding license:', error);
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


module.exports = {
    getUserID,
    getAllDriver,
    getAllAdmin,
    getInfoById,
    uploadAvatar,
    updateUserInfo,
    adminUpdateUser,
    checkPassword,
    updatePassword,
    addNewUser,
    addLicenseId,
    deleteUserController,
    disableUser,
    enableUser
};

