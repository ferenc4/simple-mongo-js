const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//Used this instead of redis, because of developing on Windows at the time
const CachemanMongo = require('cacheman-mongo');
const Message = require('./models/message');
//Connect to mongoose
let uri = "mongodb://localhost/messages";
// let uri = "mongodb://messenger:mysafepassword@freecluster-shard-00-00-bsa9p.mongodb.net:27017/telstra-grad-interview-2019&authSource=admin";
mongoose.connect(uri);
let cache = new CachemanMongo(uri, {collection: 'cache'});
let db = mongoose.connection;
let timeToLive = 30;//seconds
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function (req, res) {
    res.send("See endpoints.json for usage, and readMe.md for more info");
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

saveToCache = function (key, value) {
    cache.set(key, value, timeToLive, function (err, value) {
        if (err) throw err;
        console.log(value);
    });
};

app.get('/messages/:id', function (req, res) {
    let id = req.params.id;
    let response = {status: 200};
    cache.get(id, function (err, data) {
        if (err) throw err;
        if (data) {
            console.log("Retrieved from cache: " + JSON.stringify(data));
            response.data = data;
            res.json(response)
        } else {
            Message.getMessageById(id, function (err, data) {
                if (err) {
                    response.status = err.code;
                    response.message = err.errmsg;
                    res.json(response);
                } else {
                    if (data) {
                        saveToCache(data.id, data);
                        console.log("Retrieved from db: " + JSON.stringify(data));
                        response.data = data;
                        res.json(response)
                    } else {
                        response.status = 404;
                        response.message = "Resource not found";
                        res.json(response)
                    }
                }
            });
        }
    });
});
app.post('/messages', function (req, res) {
    let response = {status: 200};
    let data = {
        _id: req.body.id,
        message: req.body.message
    };
    Message.addMessage(data, function (err, data) {
        if (err) {
            response.status = err.code;
            response.message = err.errmsg;
            res.json(response);
        }
        else {
            response.data = data;
            res.json(response);
        }
    })
});
app.post('/admin/cache/clear', function (req, res) {
    cache.clear(function (err) {
        if (err) throw err;
        res.json({status: 204})
    });
});
app.post('/admin/cache', function (req, res) {
    timeToLive = req.body.timeToLive;
    res.json({status: 204})
});
const port = process.env.PORT || 3000;
let server = app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});