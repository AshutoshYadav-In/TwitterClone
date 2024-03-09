const cloudinary = require("../Utils/Cloudinary.js");
const fs = require("fs");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Filter = require("bad-words");
const filter = new Filter();
const userModel = require("../Models/User.js");
const tweetModel = require("../Models/Tweet.js");
const commentModel = require("../Models/Comment.js");
dotenv.config();

// Define Zod schema for validation
const UserSchema = z.object({
  name: z.string().max(20).optional(),
  bio: z.string().max(100).optional(),
  password: z
    .string()
    .max(100)
    .min(8)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
      message: "Pattern mismatch",
    })
    .optional(),
  confirmpassword: z.string().max(100).optional(),
  tweetText: z.string().max(200).optional(),
});

//update profile
const updateUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { name, bio, password, confirmpassword } = req.body;
    // Validate request body against Zod schema
    UserSchema.parse({
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
    console.log(error);
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

//follow unfollow
const followToggle = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.user;
    if (id === userId) {
      return res.status(400).json({ message: "Can't follow itself" });
    }
    const userFollowed = await userModel.findById(id);
    if (!userFollowed) {
      return res.status(400).json({ message: "User not found" });
    }
    const userFollowing = await userModel.findById(userId);
    if (!userFollowing) {
      return res.status(400).json({ message: "User not found" });
    }
    const isAlreadyFollowed = userFollowing.following.includes(
      userFollowed._id
    );
    if (isAlreadyFollowed) {
      userFollowing.following = userFollowing.following.filter(
        (id) => id.toString() !== userFollowed._id.toString()
      );
    } else {
      userFollowing.following.push(userFollowed._id);
    }

    const isAlreadyFollowing = userFollowed.followers
      .map((id) => id.toString())
      .includes(userFollowing._id.toString());
    if (isAlreadyFollowing) {
      userFollowed.followers = userFollowed.followers.filter(
        (id) => id.toString() !== userFollowing._id.toString()
      );
    } else {
      userFollowed.followers.push(userFollowing._id);
    }

    // Save changes
    await userFollowed.save();
    await userFollowing.save();

    res
      .status(200)
      .json({ message: "Toggle Success", userFollowed, userFollowing });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "An error occurred" });
  }
};

//Post tweet
const postTweet = async (req, res) => {
  const { tweetText } = req.body;
  try {
    const { userId } = req.user;
    const tweetId = req.params.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!tweetText) {
      return res.status(400).json({ message: "Please write tweet" });
    }
    UserSchema.parse({
      tweetText,
    });

    let imageUrl = "";
    if (req.file) {
      const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "Tweetimages",
      });
      imageUrl = cloudinaryUpload.secure_url;
      fs.unlinkSync(req.file.path);
    }

    let newTweetData = {
      user: userId,
      text: tweetText,
      image: imageUrl,
      quotefor: [],
    };

    if (tweetId !== "none") {
      newTweetData.quotefor.push(tweetId);
    }
    const newTweet = new tweetModel(newTweetData);
    await newTweet.save();

    if (tweetId !== "none") {
      const tweetForQuote = await tweetModel.findById(tweetId);
      if (tweetForQuote) {
        tweetForQuote.quotes.push(newTweet._id);
        await tweetForQuote.save();
      }
    }
    user.tweets.push(newTweet._id);
    await user.save();
    res.status(201).json({ message: "Tweet successful" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "An error occurred" });
  }
};

//like tweet
const likeTweet = async (req, res) => {
  try {
    const tweetId = req.params.id;
    if (!tweetId) {
      return res.status(400).json({ message: "Please provide tweet id" });
    }
    const { userId } = req.user;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const tweet = await tweetModel.findById(tweetId);
    if (!tweet) {
      return res.status(400).json({ message: "Tweet not found" });
    }
    const likedIndex = tweet.likes.indexOf(userId);
    if (likedIndex !== -1) {
      tweet.likes.splice(likedIndex, 1);
      await tweet.save();
      const userLikedIndex = user.likes.indexOf(tweetId);
      if (userLikedIndex !== -1) {
        user.likes.splice(userLikedIndex, 1);
        await user.save();
      }
      return res.status(200).json({ message: "Tweet unliked successfully" });
    } else {
      tweet.likes.push(userId);
      await tweet.save();
      user.likes.push(tweetId);
      await user.save();
      return res.status(200).json({ message: "Tweet liked" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//repost tweet
const repostTweet = async (req, res) => {
  try {
    const tweetId = req.params.id;
    if (!tweetId) {
      return res.status(400).json({ message: "Please provide tweet id" });
    }
    const { userId } = req.user;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const tweet = await tweetModel.findById(tweetId);
    if (tweet.user.toString === tweetId) {
      return res
        .status(400)
        .json({ message: "Can't repost with same account" });
    }
    if (!tweet) {
      return res.status(400).json({ message: "Tweet not found" });
    }
    const repostedIndex = user.reposts.indexOf(tweetId);
    if (repostedIndex !== -1) {
      user.reposts.splice(repostedIndex, 1);
      const tweetRepostedIndex = tweet.reposts.indexOf(userId);
      if (tweetRepostedIndex !== -1) {
        tweet.reposts.splice(tweetRepostedIndex, 1);
        await tweet.save();
      }
      await user.save();
      return res.status(200).json({ message: "Undo repost success" });
    } else {
      user.reposts.push(tweetId);
      tweet.reposts.push(userId);
      await user.save();
      await tweet.save();
      return res.status(200).json({ message: "Tweet reposted" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// post comment
const postComment = async (req, res) => {
  try {
    const { userId } = req.user;
    const tweetId = req.params.id;
    const { tweetText } = req.body;
    if (!tweetText) {
      return res.status(400).json({ message: "Please provide text" });
    }
    UserSchema.parse({
      tweetText,
    });
    const tweet = await tweetModel.findById(tweetId);
    if (!tweet) {
      return res.status(400).json({ message: "Invalid tweet id" });
    }

    let image = "";
    if (req.file) {
      const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "Tweetimages",
      });
      image = cloudinaryUpload.url;
      fs.unlinkSync(req.file.path);
    }
    const comment = new commentModel({
      user: userId,
      tweet: tweetId,
      tweetText: tweetText,
      image: image,
    });
    tweet.comments.push(comment._id);
    await tweet.save();
    await comment.save();

    res.status(201).json({ message: "Comment posted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "An error occurred" });
  }
};

// delete comment
const deleteComment = async (req, res) => {
  try {
    const { userId } = req.user;
    const commentId = req.params.id;
    const comment = await commentModel.findById(commentId);

    if (!comment) {
      return res.status(400).json({ message: "Invalid comment id" });
    }
    if (comment.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }
    if (comment.image !== "") {
      const oldImagePublicId = comment.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`Tweetimages/${oldImagePublicId}`);
    }
    const tweetId = comment.tweet;
    const tweet = await tweetModel.findById(tweetId);
    tweet.comments = tweet.comments.filter(
      (comment) => comment.toString() !== commentId
    );
    await tweet.save();
    await commentModel.findByIdAndDelete(commentId);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//delete tweet
const deleteTweet = async (req, res) => {
  try {
    const { userId } = req.user;
    const tweetId = req.params.id;
    const tweet = await tweetModel.findById(tweetId);
    if (!tweet) {
      return res.status(400).json({ message: "Tweet Doesn't Exists" });
    }
    if (tweet.user.toString() !== userId) {
      return res.status(400).json({ message: "Unauthorized" });
    }
    tweet.deleted = true;
    await tweet.save();
    res.status(200).json({ message: "Tweet deleted successfully" });
  } catch (error) {}
};

//delete account
const deleteAccount = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.deleted = true;
    await user.save();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//GET APIS FROM HERE

//get user
const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    if (!user || user.deleted === true) {
      return res.status(400).json({ message: "User not found" });
    }
    const { password, tweets, reposts, likes, deleted, ...rest } =
      user.toObject();
    return res.status(200).json({ user: rest });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get user likes/comments/posts
// const getTweet = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const type = req.params.type;

//     // Check if user exists and is not deleted
//     const user = await userModel.findById(userId);
//     if (!user || user.deleted) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     let tweets = [];

//     // Fetch tweets based on the type
//     if (type === 'posts') {
//       // Fetch original tweets, quoted tweets, and reposted tweets
//       const userTweets = await tweetModel.find({
//         $and: [
//           { user: userId },
//           { $or: [{ deleted: { $exists: false } }, { deleted: false }] }
//         ]
//       }).populate('quotes').populate('quotefor');

//       const repostedTweets = await tweetModel.find({
//         $and: [
//           { reposts: userId },
//           { $or: [{ deleted: { $exists: false } }, { deleted: false }] }
//         ]
//       }).populate('quotes').populate('quotefor');

//       tweets = userTweets.concat(repostedTweets);
//     } else if (type === 'liked') {
//       // Fetch liked tweets
//       const likedTweetIds = user.likes.filter(tweetId => !tweetId.deleted);
//       tweets = await tweetModel.find({
//         $and: [
//           { _id: { $in: likedTweetIds } },
//           { $or: [{ deleted: { $exists: false } }, { deleted: false }] }
//         ]
//       }).populate('quotes').populate('quotefor');
//     } else if (type === 'commented') {
//       // Fetch commented tweets
//       const commentedTweetIds = await commentModel.find({
//         $and: [
//           { user: userId },
//           { $or: [{ deleted: { $exists: false } }, { deleted: false }] }
//         ]
//       }).distinct('tweet');

//       tweets = await tweetModel.find({
//         $and: [
//           { _id: { $in: commentedTweetIds } },
//           { $or: [{ deleted: { $exists: false } }, { deleted: false }] }
//         ]
//       }).populate('quotes').populate('quotefor').populate('comments');
//     } else {
//       return res.status(400).json({ message: "Invalid type" });
//     }

//     // Send the fetched tweets
//     res.json({ tweets });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const getTweet = async (req, res) => {
  try {
    const userId = req.params.id;
    const type = req.params.type;
    const user = await userModel.findById(userId);
    if (!user || user.deleted) {
      return res.status(400).json({ message: "User not found" });
    }
    if (type === "posts") {
      const tweets = await tweetModel
        .find({
          user: userId,
          deleted: { $ne: true },
        })
        .populate({
          path: "user",
          match: { deleted: { $ne: true } },
        })
        .populate("quotefor");
      return res.status(200).json({ tweets });
    }
    if (type === "reposts") {
      let tweets = [];
      for (const repostId of user.reposts) {
        const repostedTweet = await tweetModel
          .findOne({
            _id: repostId,
            deleted: { $ne: true },
          })
          .populate({
            path: "user",
            match: { deleted: { $ne: true } },
          })
          .populate("quotefor");
        if (repostedTweet) {
          tweets.push(repostedTweet);
        }
      }
      return res.status(200).json({ tweets });
    } else if (type === "likes") {
      let tweets = [];
      const likedTweetIds = user.likes.filter((tweetId) => !tweetId.deleted);
      tweets = await tweetModel
        .find({
          _id: { $in: likedTweetIds },
          deleted: { $ne: true },
        })
        .populate({
          path: "user",
          match: { deleted: { $ne: true } },
        })
        .populate("quotefor");
      tweets = tweets.filter((tweet) => tweet.user !== null);
      return res.status(200).json({ tweets });
    } else if (type === "replies") {
      let tweets = [];
      const commentedTweetIds = await commentModel
        .find({
          user: userId,
          deleted: { $ne: true },
        })
        .distinct("tweet");
      tweets = await tweetModel
        .find({
          _id: { $in: commentedTweetIds },
          deleted: { $ne: true },
        })
        .populate({
          path: "user",
          match: { deleted: { $ne: true } },
        })
        .populate("comments")
        .populate("quotefor");
      tweets = tweets.filter((tweet) => tweet.user !== null);
      return res.status(200).json({ tweets });
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//module export
module.exports = {
  updateUser,
  postTweet,
  likeTweet,
  repostTweet,
  postComment,
  followToggle,
  deleteComment,
  deleteTweet,
  deleteAccount,
  getUser,
  getTweet,
};
