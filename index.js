require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const UserRouter = require('./routes/UserRouter');

const app = express();

const DB_URI = process.env.NODE_ENV === 'production' ? process.env.PROD_DB_URI : process.env.DEV_DB_URI;

mongoose.connect(DB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(express.json());
app.use('/user', UserRouter);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});