'use strict';

const express = require('express');
const {
    // checkLoginController,
    checkLoginStatus,
    logout, } = require('../controllers/loginController');
const router = express.Router();

// router.post('/check-login', checkLoginController);
router.post('/check-status/', checkLoginStatus);
router.post('/logout', logout);



module.exports = {
    routes: router
}
