/**
 * Created by Ferenc on 29/04/2018.
 */

// Config
const config = require('./config/config');

// Server
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({extended: true}));

// Database
const mongoose = require('mongoose');
mongoose.connect(config.db);
let db = mongoose.connection;

// Routes
const routes = require('./routes/index');
routes(app);

// Server
const port = process.env.PORT || 3000;
let server = app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});