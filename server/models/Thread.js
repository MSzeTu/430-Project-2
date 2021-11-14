const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let ThreadModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim(); //Might not need this

const ThreadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },

    text: {
        type: String,
        required: true,
    },
    replies: {
        type: Array
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
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
}

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
module.exports.ThreadModel = ThreadModel;
module.exports.DomoSchema = ThreadSchema;