const express = require('express');
const mongoose = require('mongoose');
const { Organization } = require('../models/organization');
const { User } = require('../models/user');

//Organizations Router
const router = express.Router();

//Create Enum
const UserPermissions = {};
const values = ['Owner', 'Admin', 'Member'];
for (const val of values) {
    UserPermissions[val] = val;
}
Object.freeze(UserPermissions);

//GET ALL
//Return every user in database for a search
router.get("/", (req, res) => {
    User.find({}, {full_name: 1, first_name : 1, last_name : 1}, (err, docs) => {
        if (err || docs == null) res.json({"Error": (docs != null)? err:"Docs is null"})
        else res.json(docs)
    });
});

//POST
//TODO: Determine if auth_id check is needed to limit to 1 user per netlify account
router.post("/", (req, res) =>{
    if(req.body.exists){
        res.json({"Message" : "This user already exists."});
    } else {
        //Create a new User
        User.create(req.body).then(result => {
            res.json({"Message" : `User ${result.full_name} created successfully`})
        }).catch( err => res.json({"Error": err}))
    }
    
});

//Get 1 - A
//Return own user that matches authID
router.get("/my", (req, res) =>{
    User.findOne({auth_id: req.body.auth_id}, (err, docs) => {
        if (err || docs == null) res.json({"Error": (docs != null)? `${err +""}`:"Docs is null"})
        else res.json(docs)
    });
});

//GET 1 - B
//Return another user that matches userID
router.get("/:userID", (req, res) =>{
    User.findOne(
        {_id : req.params.userID}, 
        {first_name : 1, last_name : 1, full_name : 1, name : 1},
        (err, docs) => {
        if (err || docs == null) res.json({"Error": (docs != null)? `${err +""}`:"Docs is null"})
        else res.json(docs)
    })
});

//PUT (update)
router.put("/my", (req, res) =>{
    //Update user fields
    User.findByIdAndUpdate(
        {auth_id : req.body.auth_id},
        req.body,
        (err, docs) =>{
            if (err || docs == null) res.json({"Error": (docs != null)? `${err +""}`:"Docs is null"})
            else res.json(docs)
        }
    );
});

//DELETE
//TODO: Base operation off of auth_id
router.delete("/:userID", (req, res) =>{
    //Delete user and update org
    User.findByIdAndDelete(req.params.userID).then( result =>{
        result.organization_ids.forEach(id => {
            Organization.findOne({'_id' : mongoose.Types.ObjectId(id)}, {'users':1},
            (err, docs) => {
                if (err || docs == null){
                    res.json({"Error": (docs != null)? `${err +""}`:"Docs is null"})
                } else {
                    docs.users.delete(result._id)
                    docs.save( sErr => {
                        if (sErr){
                            res.json({"Error":`${sErr +""}`})
                        } else {
                            res.json({"message" : `User ${result.full_name} deleted successfully.`});
                        }
                    });
                }
            });
        })
    }).catch( err => {
        res.json({"Error": `${err +""}`});
    });
});

//Exports
module.exports = {router, UserPermissions};
