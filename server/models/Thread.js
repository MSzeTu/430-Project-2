const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//const _ = require('underscore');

let ThreadModel = {};
let CommentModel = {};

const convertId = mongoose.Types.ObjectId;

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

ThreadSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return ThreadModel.find(search).select('name text').lean().exec(callback);
};

ThreadSchema.statics.getAll = (callback) => {
  ThreadModel.find(callback).lean();
};

ThreadSchema.statics.findByName = (namef, callback) => {
  const search = {
    namef,
  };
  return ThreadModel.findOne(search).exec(callback);
};

ThreadSchema.statics.delete = (namef, callback) => { // Calls the delete function
  ThreadModel.deleteOne({ name: namef }).exec(callback);
};

ThreadModel = mongoose.model('Thread', ThreadSchema);
CommentModel = mongoose.model('Comment', CommentSchema);
module.exports.ThreadModel = ThreadModel;
module.exports.ThreadSchema = ThreadSchema;
module.exports.CommentModel = CommentModel;
module.exports.CommentSchema = CommentSchema;
