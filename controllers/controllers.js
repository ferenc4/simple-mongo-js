/**
 * Created by Ferenc on 29/04/2018.
 */
//Used this instead of redis, because of developing on Windows at the time
const CachemanMongo = require('cacheman-mongo');
const Message = require('../models/message');
const config = require('../config/config');
let cache = new CachemanMongo(config.db, config.cache.collectionName);
let timeToLive = config.cache.timeToLive;

const saveToCache = (key, value) => {
    cache.set(key, value, timeToLive, (err, value) => {
        if (err) throw err;
        console.log(value);
    });
};

module.exports = {
    home: (req, res) => {
        res.send("See endpoints.json for usage, and readMe.md for more info");
    },
    // Testing only
    getAllMessages: (req, res) => {
        Message.getMessages((err, messages) => {
            if (err) {
                res.json(err);//testing only
            } else {
                res.json(messages);
            }
        })
    },
    getMessage: (req, res) => {
        let id = req.params.id;
        let response = {status: 200};
        cache.get(id, (err, data) => {
            if (err) throw err;
            if (data) {
                console.log("Retrieved from cache: " + JSON.stringify(data));
                response.data = data;
                res.json(response)
            } else {
                Message.getMessageById(id, (err, data) => {
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
    },
    addMessage: (req, res) => {
        let response = {status: 200};
        let data = {
            _id: req.body.id,
            message: req.body.message
        };
        Message.addMessage(data, (err, data) => {
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
    },
    clearCache: (req, res) => {
        cache.clear((err) => {
            if (err) throw err;
            res.json({status: 204})
        });
    },
    setCacheTtl: (req, res) => {
        timeToLive = req.body.timeToLive;
        res.json({status: 204})
    }
};