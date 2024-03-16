const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Filter = require("bad-words");
const filter = new Filter();
const userModel = require('../Models/User.js')
dotenv.config();


// Define Zod schema for validation
const signupSchema = z.object({
    name: z.string().max(20),
    username: z.string().max(20),
    email: z.string().email(),
    password: z
      .string()
      .max(100)
      .min(8)
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,{message:"Pattern mismatch"}),
    confirmpassword: z.string().max(100)
  });

const signinSchema =z.object({
    email: z.string().email(),
})
//signup user
const signupUser = async(req,res)=>{
let{name,username,email,password,confirmpassword} =req.body;
email = email.toLowerCase();
try{
       // Validate request body against Zod schema
       signupSchema.parse({
        name,
        username,
        email,
        password,
        confirmpassword,
      });
    const combinedBadWordsCheck = `${name} ${username}`;
    if(filter.isProfane(combinedBadWordsCheck)){
      return res.status(400).json({message:"Sensitive words are not allowed"})
    }
    if (!name || !username|| !email || !password || !confirmpassword) {
        return res
          .status(400)
          .json({ error: "Please provide all required fields" });
      }
      if(password !== confirmpassword){
        return res.status(401).json({message:"Passwords must match"})
      }
      let existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
       existingUser = await userModel.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new userModel({
        username,
        name,
        email,
        password:hashedPassword,
        confirmpassword
      });
      await user.save();
      return res.status(201).json({ message: "Registration Successful" });
}catch(error){
    if (error instanceof z.ZodError) {
        // Handle validation errors
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
}

//sign in controller
const signinUser =async(req,res)=>{
    let { email, password } = req.body;
    email = email.toLowerCase();
    try{
    signinSchema.parse({
        email
    })
        if (!email || !password) {
            return res
              .status(400)
              .json({ message: "Please provide email and password" });
          }
          const user = await userModel.findOne({ email });
          if(user.deleted === true){
            return res.status(401).json({ message: "User not found" });
          }
          if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
          }
          const payload = {
            userId: user._id,
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET);
          const { password:userPassword,tweets,reposts,likes,deleted, ...userObject } = user.toObject();
          const userDetails = {
            token,
            user:userObject,
          };
          res.status(200).json({message:"Sign in successful",  userDetails });
    }catch(error){
        if (error instanceof z.ZodError) {
            // Handle validation errors
            return res.status(400).json({ message: error.errors[0].message });
          }
          return res.status(500).json({ message: "Internal Server Error" });
        }
    }
//exporting controllers
module.exports ={
    signupUser,
    signinUser,
}