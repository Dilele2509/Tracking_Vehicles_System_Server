'use strict';

const { checkLogin,
        checkPassword } = require('../data/login');


const checkLoginController = async (req, res) => {
    try {
        const data = req.body;
        const check = await loginData.checkLogin(data);
        if(check === 1){
            const userInfo = await userData.getByEmail(data);
            //console.log(userInfo[0].id);
            // Set the user ID in a cookie
            res.cookie('userId', userInfo[0].id,{ httpOnly: true });
            return res.send(userInfo);
        }else{
            const checkEmail = await userData.checkEmailExist(data.email);
            const checkPassword = await loginData.checkPassword(data.password);
            if(checkEmail !== 1){
                return res.send({
                    status: 'Error',
                    problem: 'Email',
                    message: 'This email does not exist'
                })
            }else if(checkPassword !== 1){
                return res.send({
                    status: 'Error',
                    problem: 'Password',
                    message: 'Incorrect password'
                })
            }else{
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
    const userIdFromCookie = req.cookies.userId;
    const userIdFromBody = req.body.userId; 

    if(userIdFromCookie && userIdFromCookie === userIdFromBody){
        res.send({
            status: true,
            message: 'logged'
        });
    }else{
        res.send({
            status: false,
            message: 'not logged in yet'
        });
    }
  
};


const logout = (req, res) => {
    res.clearCookie('userId');
    res.send({
    status: true,
    message: 'Logged out successfully',
    });
  };

module.exports = {
    checkLoginController,
    checkLoginStatus,
    logout
}