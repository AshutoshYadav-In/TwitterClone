const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: '', 
  },
  profileimage: {
    type: String,
    default: '', 
  },
  coverimage: {
    type: String,
    default: '', 
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  reposts:[{type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  deleted: { type: Boolean, default: false },
});

const Usermodel = mongoose.model("User", userSchema);

module.exports = Usermodel;
