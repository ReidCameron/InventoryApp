const express = require ('express');
const path = require('path');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
// const cors = require('cors');

//Create Express App
const app = express();

//Middleware
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Database MonogoDB
console.log("Connecting to Database...")
const dbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.csag5ai.mongodb.net/inventory-app?retryWrites=true&w=majority`
const dbPromise = mongoose.connect(process.env.dbURI_INVENTORY_APP)
dbPromise.then( result => {
    console.log("Connected to database");
}).catch( err => {console.log(err)});

//API
const apiRouter = require('../api/apiRouter'); //express.Router();
const apiRoute = "/.netlify/functions/server/api"

//Netlify Lambda Function
app.use(apiRoute, apiRouter);

//404 TODO: Might not need this...figure out if angular handles the 404
app.use("/", (req, res) =>{
    res.sendFile(path.join(process.cwd(), "./404.html"));
});

// module.app = app;
module.exports = {app, dbPromise};
module.exports.handler = serverless(app);