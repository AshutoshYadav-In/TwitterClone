const express = require('express');
const router = express.Router();
const upload = require("../Middleware/Multer.js");
const verifyToken = require('../Middleware/Jwtauth.js');
const X  = require('../Controllers/X.js')

//define routing
router.post('/updateprofile/:id',verifyToken,upload.fields([{ name: 'profileimage', maxCount: 1 }, { name: 'coverimage', maxCount: 1 }]) ,X.updateUser)
module.exports = router;