'use strict';

const express = require('express');
const {
    loginController,
    checkLoginStatus,
    logout, } = require('../controllers/loginController');
const router = express.Router();

router.post('/user-login', loginController);
router.get('/check-status/', checkLoginStatus);
router.get('/logout', logout);



module.exports = {
    routes: router
}
