const express = require('express');
const router = express.Router();
const upload = require("../Middleware/Multer.js");
const verifyToken = require('../Middleware/Jwtauth.js');
const X  = require('../Controllers/X.js')

//define routing
router.post('/updateprofile/:id',verifyToken,upload.fields([{ name: 'profileimage', maxCount: 1 }, { name: 'coverimage', maxCount: 1 }]) ,X.updateUser);
router.post('/posttweet/:id',verifyToken,upload.single('image'),X.postTweet);
router.get('/Liketweet/:id',verifyToken,X.likeTweet);
router.get('/reposttweet/:id',verifyToken,X.repostTweet)
router.post('/comment/:id',verifyToken,upload.single('image'),X.postComment);
router.get('/follow/:id',verifyToken,upload.single("image"),X.followToggle);
router.delete('/deletecomment/:id',verifyToken,X.deleteComment);
router.delete('/deletetweet/:id',verifyToken,X.deleteTweet);
router.delete('/deleteaccount',verifyToken,X.deleteAccount);
router.get('/getuser/:id',verifyToken,X.getUser);
router.get('/gettweet/:id/:type',verifyToken,X.getTweet);
router.get('/tweet/:id' , X.singleTweet);
router.get('/followinfo' ,verifyToken, X.followInfo)
module.exports = router;