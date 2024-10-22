'use strict';

const { findById } = require('../data/user'); 


const getInfoById = async (req, res) => {
    try {

        const userId = req.cookies.userId; 
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in cookies' });
        }
        const user = await findById(userId); 
        console.log('cai loz ', user)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            id: userId,
            role_id: user.role_id,
            fullname: user.fullname,
            birthday: user.birthday,
            phone_number: user.phone_number,
            email: user.email,
            avatar: '/avatars/default_ava.png',
            deleted: user.deleted
        });
    } catch (error) {
        console.error('Error fetching user info:', error); 
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getInfoById };