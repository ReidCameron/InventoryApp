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
const dbPromise = mongoose.connect(process.env.dbURI_INVENTORY_APP)
dbPromise.then( result => {
    console.log("Connected to database");
}).catch( err => {console.log(err)});

//API
const apiRouter = require('../api/apiRouter'); //express.Router();
// const apiRoute = "/.netlify/functions/server/api"
const apiRoute = "api"

//Netlify Lambda Function
// app.get("/.netlify/functions/identity-login", (req, res) =>{
  // console.log("user logged in");
// });
app.use(apiRoute, apiRouter);

//Angular App DEBUG
app.use(express.static('dist'));
app.get("/*", (req, res) =>{
  res.sendFile(path.join(__dirname, "../dist/index.html"))
})

module.exports = {app, dbPromise};
// module.exports.handler = serverless(app); //OLD
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  const { identity, user } = context.clientContext;
  console.log("hello");
  return result;
};
