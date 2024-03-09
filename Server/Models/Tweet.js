const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tweetSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  image: { type: String, default:"" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  quotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }], 
  quotefor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  deleted: { type: Boolean, default: false },
},{ timestamps: true });

const tweetModel = mongoose.model('Tweet', tweetSchema);

module.exports = tweetModel;
