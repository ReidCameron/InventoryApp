const express = require('express');
const mongoose = require('mongoose');
const { Organization } = require('../models/organization');
const { User } = require('../models/user');
const UserPermissions  = require('./userRouter').UserPermissions;

//Organizations Router
const router = express.Router();

//TODO: Add owner_id checks for mutable requests or just check user permission
//GET ALL
//Return every Organization from the database for a frontend autofill search bar
router.get("/", (req, res) => {
    //  This can be useful when looking for an org to join
    // TODO: Project data to speed up retrieval
    Organization.find().then( result => {
        res.json(result);
    }).catch( err => {
        res.json({"Error": err})
    });
});

//POST
//http://localhost:3000/.netlify/functions/server/api/v1/organizations/debug
//Create a new Organization
router.post("/", (req, res) =>{
    const owner_id = mongoose.Types.ObjectId(req.body.owner_id);
    
    User.exists({_id:owner_id}, (err, docs)=> { 
        //Check if valid ownerID
        if (docs == null){
            res.json({"Error": "Owner ID does not exist"});
            return;
        }

        //Add Owner as first user with owner permissions
        const users = new Map();
        users.set(req.body.owner_id, UserPermissions.Owner);
        req.body.users = users;

        //Create and Save org
        Organization.create(req.body).then( result => {

            //Add orgID to user document
            User.updateOne({_id:owner_id},
                { $addToSet : {organization_ids : result._id} }, 
                (err, docs) => {
                    if(err || docs == null) res.json({"Error": (docs != null)? err:"Docs is null"})
                    else res.json({"Message" : `Organization ${result.name} created successfully.`});
                }
            );
        }).catch( err => res.json( {"Error": err} ) );
    });
});

//GET 1
//Return org that matches orgID
//TODO: Project to not include items or categories after debug is complete
router.get("/:orgID", (req, res) =>{
    Organization.findById(req.params.orgID).then( result => {
        res.json(result);
    }).catch( err => {
        res.json({"Error": err});
    });
});

//PUT (update)
//Update Org name, and user permisions only (for other attributes use another endpoint)
router.put("/:orgID", (req, res) =>{
    Organization.updateOne({_id : mongoose.Types.ObjectId(req.params.orgID)}, 
        {//TODO: Change to req.body
            name: req.body.name,
            users: req.body.users
        }, (err, docs) => {
            if(!err && docs.modifiedCount >= 1) {
                res.json({"Message": "Organization updated successfully."});
            } else if(err){
                res.json({"Error": err});
            } else if(docs.matchedCount === 0){
                res.json({"Error": "No matching organization was found."});
            } else {
                res.json({"Error": "No change was made to the Organization. This could be due to a redundant update."});
            }
        }
    );
});

//DELETE
//Delete org and update users
router.delete("/:orgID", (req, res) =>{
    const orgID = mongoose.Types.ObjectId(req.params.orgID)
    Organization.findByIdAndDelete(req.params.orgID).then( result =>{
        if(result != null){
            User.updateMany(
                {organization_ids : orgID},
                {$pull : {organization_ids : orgID}},
                (err, docs) => {
                    if(err || docs == null){
                        res.json({"Error": (docs != null)? err:"Docs is null"})
                    } else {
                        res.json({"Message":"Organization deleted successfully."})
                    }
                }
            )
        } else {
            res.json({"Error": "Org does not exist"});
        }
    }).catch( err => {
        res.json({"Error": err + ""});
    });
});

//GET Departments
router.get("/:orgID/departments", (req, res) =>{
    Organization.findOne(
        {_id: mongoose.Types.ObjectId(req.params.orgID)}, 
        {'_id':0,'departments' : 1},
        (err, docs) => {
            if (err || docs == null) res.json({"Error": (docs != null)? err:"Docs is null"})
            else res.json(docs.departments)
        }
    );
});

//POST Department
router.post("/:orgID/departments", (req, res) =>{
    //Create a new department
    Organization.updateOne(
        {"_id" : mongoose.Types.ObjectId(req.params.orgID)}, 
        { $addToSet : {departments: new Department( req.body )} },
        err => {
            if (err) res.json({"Error": err});
            else res.json({"Message": `Dep ${req.body.name} added successfully.`});
        }
    );
});

//Get Users
router.get("/:orgID/users", (req, res) =>{
    Organization.findOne(
        {_id: mongoose.Types.ObjectId(req.params.orgID)}, 
        {'_id':0,'users' : 1},
        (err, docs) => {
            if (err || docs == null) res.json({"Error": (docs != null)? err:"Docs is null"})
            else res.json(docs.users)
        }
    );
});

//POST User
router.post("/:orgID/users/:userID", (req, res) =>{
    //Add a user to this org
    Organization.findOne({'_id' : mongoose.Types.ObjectId(req.params.orgID)},
        {'users' : 1},
        (err, docs) => {
            if (err || docs == null){
                res.json({"Error": (docs != null)? err:"Docs is null"})
            } else {
                docs.users.set(req.params.userID, "Admin")
                docs.save(sErr => {
                    if (sErr) res.json({"Error":`${sErr +""}`})
                    else res.json({"message" : `User ${result.full_name} added successfully.`});
                });
            }
        }
    );
});

//Exports
module.exports = router;
