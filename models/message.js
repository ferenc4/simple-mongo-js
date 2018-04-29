let mongoose = require('mongoose');
// message Schema
let messageSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    },
    message: {
        type: String,
        required: true
    }
});

let Message = module.exports = mongoose.model('Message', messageSchema);

// Testing only - not cached
// Get all messages
module.exports.getMessages = function (callback, limit) {
    Message.find(callback).limit(limit);
};

// Add message
module.exports.addMessage = function (message, callback) {
    Message.create(message, callback);
};

// Update message
module.exports.updateMessage = function (id, message, options, callback) {
    let query = {_id: id};
    let update = {
        message: message
    };
    Message.findOneAndUpdate(query, update, options, callback);
};

// Get message by id
module.exports.getMessageById = function (id, callback) {
    Message.findById(id, callback);
};

// Delete message
module.exports.deleteMessage = function (id, callback) {
    let query = {_id: id};
    Message.deleteOne(query, callback);
};