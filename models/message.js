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

module.exports = {
    // Testing only - not cached
    // Get all messages
    getMessages: (callback, limit) => {
        Message.find(callback).limit(limit);
    },
    // Add message
    addMessage: (message, callback) => {
        Message.create(message, callback);
    },
    // Update message
    updateMessage: (id, message, options, callback) => {
        let query = {_id: id};
        let update = {
            message: message
        };
        Message.findOneAndUpdate(query, update, options, callback);
    },
    // Get message by id
    getMessageById: (id, callback) => {
        Message.findById(id, callback);
    },
    // Delete message
    deleteMessage: (id, callback) => {
        let query = {_id: id};
        Message.deleteOne(query, callback);
    }
};