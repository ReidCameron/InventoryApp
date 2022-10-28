const express = require('express');
const mongoose = require('mongoose');
const organizationRouter = require('./organizationRouter');
const departmentRouter = require('./departmentRouter');
const categoryRouter = require('./categoryRouter');
const itemRouter = require('./itemRouter');
const userRouter = require('./userRouter').router;

//Example URLs
// https://www.app.domain.com/api/v1/organizations/orgID
// https://www.app.domain.com/api/v1/departments/depID
// https://www.app.domain.com/api/v1/categories/catID
// https://www.app.domain.com/api/v1//items/itemID
// https://www.app.domain.com/api/v1/users/userID
// http://inventoryapp-reidcj.netlify.app/.netlify/functions/server/api/v1/

const router = express.Router();
const v = "v1"; //version number, (v1, v2, v3, etc.) //version number

//API Routes
router.get("/", (req, res) => {
    console.log("api called");
    res.json({"message": "base api endpoint connected"}); //TODO: Add docs to response
});

//Middleware

//Format input string
router.use("/", (req, res, next) => {
    //prevents fields from being set to empty string
    for(key of Object.keys(req.body)){
        if(req.body[key] == ""){
            delete req.body[key];
        }
    }
    //adds objectID to prevent id change during put requests
    req.body._id = mongoose.Types.ObjectId(req.body.ID); 
    next();
});

//Routers
router.use(`/${v}/organizations`, organizationRouter); //Organization Route
router.use(`/${v}/departments`, departmentRouter); //Department Route
router.use(`/${v}/categories`, categoryRouter); //Categories Route
router.use(`/${v}/items`, itemRouter); //Items Route
router.use(`/${v}/users`, userRouter); //Users Route

//404 - Endpoint does not exist
router.use("/", (req, res) => {
    res.json({"Error": `Unknown Endpoint: ${req.url}`});
});

//Exports
module.exports = router;
