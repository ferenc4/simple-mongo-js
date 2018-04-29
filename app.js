/**
 * Created by Ferenc on 29/04/2018.
 */

const config = require('./config/config');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const app = express();

// Server
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({extended: true}));

// Database
mongoose.connect(config.db);
let db = mongoose.connection;

// Routes
routes(app);

// Server
const port = process.env.PORT || 3000;
let server = app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});