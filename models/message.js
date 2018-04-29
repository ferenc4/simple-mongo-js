var mongoose = require('mongoose');

// message Schema
var messageSchema = mongoose.Schema({
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

var Message = module.exports = mongoose.model('Message', messageSchema);

//testing only
// Get all messages
module.exports.getMessages = function (callback, limit) {
    Message.find(callback).limit(limit);
};

// Add message
module.exports.addMessage = function (message, callback) {
    Message.create(message, callback);
};

//todo
// // Update message
// module.exports.updateMessage = function (id, message, options, callback) {
//     var query = {_id: id};
//     var update = {
//         message: message
//     };
//     Message.findOneAndUpdate(query, update, options, callback);
// };

// Get message by id
module.exports.getMessageById = function (id, callback) {
    Message.findById(id, callback);
};

//todo
// // Delete genre
// module.exports.deleteGenre = function (id, callback) {
//     var query = {_id: id};
//     Genre.deleteOne(query, callback);
// };