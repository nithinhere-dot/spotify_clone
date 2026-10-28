const express = require('express');
const authcontroller = require("../controller/auth.controller")

const router = express.Router();

router.post('/register',authcontroller.registerUser)

router.post('/login',authcontroller.loginUser)

router.post('/logout',authcontroller.logOutUser)

module.exports = router;