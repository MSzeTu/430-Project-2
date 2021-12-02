const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// const _ = require('underscore');

let ThreadModel = {};
let CommentModel = {};

const convertId = mongoose.Types.ObjectId;

// Schema for comments
const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  ownerUser: {
    type: String,
    required: true,
  },
});

// Schema for Threads
const ThreadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  text: {
    type: String,
    required: true,
  },
  replies: {
    type: [CommentSchema],
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  ownerUser: {
    type: String,
    required: true,
  },
});

// Finds Thread by owners
ThreadSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return ThreadModel.find(search).select('name text').lean().exec(callback);
};

// Gets all threads
ThreadSchema.statics.getAll = (callback) => {
  ThreadModel.find(callback).lean();
};

// Gets a thread by name
ThreadSchema.statics.findByName = (title, callback) => {
  const search = {
    title,
  };
  return ThreadModel.findOne(search).exec(callback);
};

// Deletes a thread (not implemented)
ThreadSchema.statics.delete = (namef, callback) => { // Calls the delete function
  ThreadModel.deleteOne({ name: namef }).exec(callback);
};

ThreadModel = mongoose.model('Thread', ThreadSchema);
CommentModel = mongoose.model('Comment', CommentSchema);
module.exports.ThreadModel = ThreadModel;
module.exports.ThreadSchema = ThreadSchema;
module.exports.CommentModel = CommentModel;
module.exports.CommentSchema = CommentSchema;
