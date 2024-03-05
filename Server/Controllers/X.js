const cloudinary = require("../Utils/Cloudinary.js");
const fs = require("fs");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Filter = require("bad-words");
const filter = new Filter();
const userModel = require("../Models/User.js");
dotenv.config();

// Define Zod schema for validation
const updateUserSchema = z.object({
  name: z.string().max(20),
  bio: z.string().max(100),
  password: z
    .string()
    .max(100)
    .min(8)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
      message: "Pattern mismatch",
    }).optional(),
  confirmpassword: z.string().max(100).optional(),
});

//update profile
const updateUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { name, bio, password, confirmpassword } = req.body;
    // Validate request body against Zod schema
    updateUserSchema.parse({
      name,
      bio,
      password,
      confirmpassword,
    });
    const checkWords = `${name} ${bio}`;
    if (filter.isProfane(checkWords)) {
      return res
        .status(400)
        .json({ message: "Sensitive words are not allowed" });
    }

    if (userId !== id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password !== confirmpassword) {
      return res.status(401).json({ message: "Passwords must match" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (bio) {
      user.bio = bio;
    }

    if (name) {
      user.name = name;
    }
    const uploadImage = async (file, imageType) => {
      if (user[imageType] && user[imageType] !== "") {
        const oldImagePublicId = user[imageType].split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`Userimages/${oldImagePublicId}`);
      }
      const cloudinaryUpload = await cloudinary.uploader.upload(file.path, {
        folder: "Userimages",
      });
      user[imageType] = cloudinaryUpload.secure_url;
    };

    for (const imageType of ["profileimage", "coverimage"]) {
      if (req.files[imageType]) {
        await uploadImage(req.files[imageType][0], imageType);
      }
    }

    await user.save();
    const { password: userPassword, ...rest } = user.toObject();
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: rest });
  } catch (error) {
    if (error instanceof z.ZodError) {
        // Handle validation errors
        return res.status(400).json({ message: error.errors[0].message });
      }
    res.status(500).json({ message: "An error occurred" });
  } finally {
    ["profileimage", "coverimage"].forEach((imageType) => {
      if (req.files[imageType]) {
        fs.unlinkSync(req.files[imageType][0].path);
      }
    });
  }
};

//module export
module.exports = {
  updateUser,
};
