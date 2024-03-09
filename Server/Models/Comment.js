const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: true },
  tweetText: { type: String, required: true },
  image: { type: String, default:"" },
}, { timestamps: true });

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;
