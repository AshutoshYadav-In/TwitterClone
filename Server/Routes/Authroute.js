const express = require('express');
const router = express.Router();
const userController =require('../Controllers/Auth.js');

//routing
router.post('/signup' ,userController.signupUser)
router.post('/signin' ,userController.signinUser)


module.exports = router;