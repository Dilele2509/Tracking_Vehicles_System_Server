'use strict';

const { checkLogin, checkPassword } = require('../data/login');
const { getUserByEmail, checkEmailExist } = require('../data/user');


const loginController = async (req, res) => {
    try {
        const data = req.body;
        const { email, password } = data;
        const login = await checkLogin(data);
        //console.log('login: ', login);
        if (login === 1) {
            const userInfo = await getUserByEmail(email);

            //console.log('userInfo: ', userInfo)
            //console.log(userInfo[0].id);
            // Set the user ID in a cookie
            res.cookie('userId', userInfo.id);
              
            return res.send(userInfo);
        } else {
            const checkEmail = await checkEmailExist(email);
            const checkPasswordTrue = await checkPassword(password);
            if (checkEmail !== 1) {
                return res.send({
                    status: 'Error',
                    problem: 'Email',
                    message: 'This email does not exist'
                })
            } else if (checkPasswordTrue !== 1) {
                return res.send({
                    status: 'Error',
                    problem: 'Password',
                    message: 'Incorrect password'
                })
            } else {
                return res.send({
                    status: 'Error',
                    message: 'Have an error'
                })
            }
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const checkLoginStatus = async (req, res) => {
    const userId = req.cookies.userId;
    /* console.log(req.cookies); */
    if (userId) {
        res.send({
            status: true,
            message: 'logged'
        });
    } else {
        res.send({
            status: false,
            message: 'not logged in yet'
        });
    }

};


const logout = (req, res) => {
    res.clearCookie('userId'); 
    res.status(200).send({
        status: true,
        message: 'Logged out successfully',
    });
};

module.exports = {
    loginController,
    checkLoginStatus,
    logout
}