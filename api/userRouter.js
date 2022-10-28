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
//Return every user in an organization
//TODO: Turn into returning every user in database for a search
router.get("/", (req, res) => {
    const orgID = mongoose.Types.ObjectId(JSON.parse(Object.keys(req.query)[0]).orgID);
    Organization.findOne({"_id": orgID}, {'_id':0,'users' : 1}, (err, docs)=>{
        if (err || docs == null) res.json({"Error": (docs != null)? err:"Docs is null"})
        else res.json(docs)
    });
});

//POST
//http://localhost:3000/.netlify/functions/server/api/v1/user/debug
router.post("/", (req, res) =>{
    //Create a new User
    const orgID = mongoose.Types.ObjectId(req.body.orgID);
    const user = new User(req.body);
    user.organization_ids.push(orgID);
    user.save().then( result => {
        const userID = result._id;
        Organization.findOne({'_id' : orgID},
            {'users' : 1},
            (err, docs) => {
                if (err || docs == null){
                    res.json({"Error": (docs != null)? `${err +""}`:"Docs is null"})
                } else {
                    docs.users.set(userID, "Admin")
                    docs.save(sErr => {
                        if(sErr){
                            res.json({"Error":`${sErr +""}`})
                        } else {
                            res.json({"message" : `User ${result.first_name} ${result.last_name} created successfully.`});
                        }
                    })
                }
            }
        );
    }).catch( err => {
        res.json({"Error": err})
    });
});

//GET 1
router.get("/:userID", (req, res) =>{
    //Return user that matches userID
    User.findById(req.params.userID).then( result => {
        res.json(result);
    });
});

//PUT (update)
router.put("/:userID", (req, res) =>{
    //Update user fields
    User.findByIdAndUpdate(req.params.userID, req.body).then( result => {
        res.json({"message" : `User ${result.first_name} ${result.last_name} updated successfully.`});
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
                            res.json({"message" : `User ${result.first_name} ${result.last_name} deleted successfully.`});
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
