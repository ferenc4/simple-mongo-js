/**
 * Created by Ferenc on 29/04/2018.
 */
//Used this instead of redis, because of developing on Windows at the time
const CachemanMongo = require('cacheman-mongo');
const Message = require('../models/message');
const config = require('../config/config');
let cache = new CachemanMongo(config.db, config.cache.collectionName);
let timeToLive = config.cache.timeToLive;

exports.home = function (req, res) {
    res.send("See endpoints.json for usage, and readMe.md for more info");
};

// Testing only
exports.getAllMessages = function (req, res) {
    Message.getMessages(function (err, messages) {
        if (err) {
            res.json(err);//testing only
        } else {
            res.json(messages);
        }
    })
};

saveToCache = function (key, value) {
    cache.set(key, value, timeToLive, function (err, value) {
        if (err) throw err;
        console.log(value);
    });
};

exports.getMessage = function (req, res) {
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
};

exports.addMessage = function (req, res) {
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
};

exports.clearCache = function (req, res) {
    cache.clear(function (err) {
        if (err) throw err;
        res.json({status: 204})
    });
};

exports.setCacheTtl = function (req, res) {
    timeToLive = req.body.timeToLive;
    res.json({status: 204})
};