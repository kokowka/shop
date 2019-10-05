const mongoose = require('mongoose');
const express = require('express');
const config = require('./config');
const cors = require('cors');
const logger = require('morgan');
const routes = require('./routes');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());

const dbConnection =
    `mongodb://${config.mongoConnection.username ? `${config.mongoConnection.user}:${config.mongoConnection.password}@`: ``}${config.mongoConnection.host}:${config.mongoConnection.port}/${config.mongoConnection.name}`;
mongoose.connect(dbConnection, { useNewUrlParser: true });

let db = mongoose.connection;
db.once('open', () => console.log('Connected to the database'));
// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/', routes);

app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
});