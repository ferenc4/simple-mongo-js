const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Message = require('./models/message');
//Connect to mongoose
var uri = "mongodb://localhost/messages";
// var uri = "mongodb://messenger:mysafepassword@freecluster-shard-00-00-bsa9p.mongodb.net:27017/telstra-grad-interview-2019&authSource=admin";
//,freecluster-shard-00-01-bsa9p.mongodb.net:27017,freecluster-shard-00-02-bsa9p.mongodb.net:27017
mongoose.connect(uri);
const db = mongoose.connection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function (req, res) {
    res.send('Send POST requests to "/message" or GET requests to "/message/:id" </a>');
});
//testing only
app.get('/messages', function (req, res) {
    Message.getMessages(function (err, messages) {
        if (err) {
            res.json(err);//testing only
        } else {
            res.json(messages);
        }
    })
});
app.get('/messages/:id', function (req, res) {
    var id = req.params.id;
    Message.getMessageById(id, function (err, data) {
        if (err) {
            res.json(err);//testing only
        } else {
            res.json(data);
        }
    })
});
app.post('/messages', function (req, res) {
    var data = {
        _id: req.body.id,
        message: req.body.message
    };
    Message.addMessage(data, function (err, data) {
        if (err) {
            res.json(err);//testing only
        }
        else {
            res.json(data);
        }
    })
});
//todo
app.post('/admin', function (req, res) {
    var action = req.body.action;
    if(action === "clearcache"){

    }
});
const port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});