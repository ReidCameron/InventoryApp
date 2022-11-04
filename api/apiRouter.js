const express = require('express');
const mongoose = require('mongoose');
const organizationRouter = require('./organizationRouter');
const departmentRouter = require('./departmentRouter');
const categoryRouter = require('./categoryRouter');
const itemRouter = require('./itemRouter');
const { User } = require('../models/user');
const userRouter = require('./userRouter').router;

//Example URLs
// http://inventoryapp-reidcj.netlify.app/.netlify/functions/server/api/v1/

const router = express.Router();
const dbRouter = express.Router();
const version = "v1"; //version number, (v1, v2, v3, etc.)

//API Routes
router.get("/", (req, res) => {
    console.log("api called");
    res.json({"message": "base api endpoint connected"}); //TODO: Add docs to response
});

//Middleware
//Limit access to API
router.use(`/${version}/:auth_id`, (req, res, next) => {
    //First Time Users (from identity-validate)
    if(req.body.access_token === process.env.access_token){
        req.body.exists = false;
        next()
    } else {
        //Existing Users (from netlify identity auth_id)
        User.exists({auth_id : req.params.auth_id}, (err, docs)=> { 
            if (docs == null){
                res.json({"Error": "Access Denied. An account is required to make an API request."});
                return;
            } else {
                req.body.auth_id = req.params.auth_id; //saves auth_id for other routes to use
                req.body.exists = true; //prevents existing users from making post requests
                next();
            }
        });
    }
});

//Use Database Router
router.use(`/${version}/:auth_id`, dbRouter);

//Format input string
dbRouter.use("/", (req, res, next) => {
    //prevents fields from being set to empty string
    for(key of Object.keys(req.body)){
        if(req.body[key] == ""){
            delete req.body[key];
        }
    }

    //adds objectID to prevent id change during put requests
    if(req.body._id !== undefined){
        req.body._id = mongoose.Types.ObjectId(req.body.ID); 
    }
    
    next();
});

//Routers
dbRouter.use("/organizations", organizationRouter); //Organization Route
dbRouter.use("/departments", departmentRouter); //Department Route
dbRouter.use("/categories", categoryRouter); //Categories Route
dbRouter.use("/items", itemRouter); //Items Route
dbRouter.use("/users", userRouter); //Users Route

//404 - Endpoint does not exist
router.use("/", (req, res) => {
    res.json({"Error": `Unknown Endpoint: ${req.url}`});
});

//Exports
module.exports = router;
