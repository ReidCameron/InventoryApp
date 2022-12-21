const express = require('express');
const mongoose = require('mongoose');
const { Organization } = require('../models/organization');
const { Category } = require('../models/category');
const { Department } = require('../models/department');

//Department Router
const router = express.Router();

//GET 1
router.get("/:depID", (req, res) =>{
    //Return department that matches depID
    Organization.findOne({"departments._id" : mongoose.Types.ObjectId(req.params.depID)},
        {"departments.$": true}, (err, docs) => {
            if(err){
                res.json({"Error": err});
            } else {
                res.json(docs.departments);
            }
        }
    );
});

//PUT (update)
router.put("/:depID", (req, res) =>{
    //Update Dep fields
    req.body._id = mongoose.Types.ObjectId(req.params.depID);
    Organization.updateOne({"departments._id" : mongoose.Types.ObjectId(req.params.depID)},
        { "$set" : {"departments.$" : new Department(req.body)} },
            (err, docs) => {
            if(!err && docs.modifiedCount >= 1){
                res.json({"Message":"Doc Updated Succesfully."});   
            } else if (err) {
                res.json({"Error": err});
            } else if(docs.matchedCount === 0){
                res.json({"Error":"Doc not found."});
            } else {
                res.json({"Error":"Doc not updated. Possibly due to redundant info."});
            }
        }
    );
});

//DELETE
router.delete("/:depID", (req, res) =>{
    //Delete department
    Organization.findOne({"departments._id" : mongoose.Types.ObjectId(req.params.depID)},
        (err, docs) => {
            if (err){
                res.json({"Error":err});
            } else {
                docs.departments.id(req.params.depID).remove((rErr, rRes) =>{
                    if(rErr){
                        res.json({"Error":rErr});
                    } else {
                        docs.save( dErr => {
                            if(dErr){
                                res.json({"Error":dErr});
                            } else {
                                res.json({"Error" : "Department deleted succesfully."})
                            }
                        });
                    }
                });
            }
        }
    );
});

//GET ALL
router.get("/:depID/categories", (req, res) => {
    //Return every category within a department
    Organization.findOne(
        {"departments._id" : mongoose.Types.ObjectId(req.params.depID)},
        {"departments.$": true}, 
        (err, docs) => {
            if(err || docs == null){
                res.json({"Error": (docs != null)? err:"Docs is null"})
            } else {
                res.json(docs.departments[0].categories)
            }
        }
    );
});

//POST
router.post("/:depID/categories", (req, res) =>{
    //Create a new category
    Organization.findOne(
        {"departments._id" : mongoose.Types.ObjectId(req.params.depID)}, 
        (err, docs) => {
            if(err || docs == null){
                res.json({"Error": (docs != null)? err:"Docs is null"})
            } else {
                const newCat = new Category(req.body);
                docs.departments.id(req.params.depID).categories.push(newCat);
                docs.save((cErr, cRes) => {
                    // console.log(newCat._id);
                    if(cErr) res.json({"Error": cErr})
                    else res.json({'_id':newCat._id, "message" : `Category ${req.body.name} created successfully.`});
                });
            }
        }
    );
});

//Exports
module.exports = router;
