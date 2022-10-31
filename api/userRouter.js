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
    User.find({}, {full_name: 1}, (err, docs) => {
        if (err || docs == null) res.json({"Error": (docs != null)? err:"Docs is null"})
        else res.json(docs)
    });
});

//POST
router.post("/", (req, res) =>{
    //Create a new User
    User.create(req.body).then(result => {
        res.json({"Message" : `User ${result.full_name} created successfully`})
    }).catch( err => res.json({"Error": err}))
});

//GET 1
//Return user that matches userID
router.get("/:userID", (req, res) =>{
    User.findById(req.params.userID).then( result => res.json(result) );
});

//PUT (update)
router.put("/:userID", (req, res) =>{
    //Update user fields
    User.findByIdAndUpdate(req.params.userID, req.body).then( result => {
        res.json({"message" : `User ${result.full_name} updated successfully.`});
    });
});

//DELETE
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
