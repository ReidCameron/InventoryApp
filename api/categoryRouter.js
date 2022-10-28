const express = require('express');
const mongoose = require('mongoose');
const { Category } = require('../models/category');
const { Organization } = require('../models/organization');

//Category Router
const router = express.Router();

//GET 1
router.get("/:catID", (req, res) =>{
    //Return category that matches catID
    const objectID = mongoose.Types.ObjectId(req.params.catID);
    Organization.findOne(
        {"departments.categories._id" : objectID},
        {"departments" : {$elemMatch : {"categories._id" : objectID}}},
        (err, docs) => {
            if(err || docs == null){
                res.json({"Error": (docs != null)? err:"Docs is null"})
            } else {
                res.json(docs.departments[0].categories.id(objectID));
            }
        }
    );
});

//PUT (update)
router.put("/:catID", (req, res) =>{
    //Update category fields
    const objectID = mongoose.Types.ObjectId(req.params.catID);
    Organization.findOne(
        {"departments.categories._id" : objectID},
        {"departments" : {$elemMatch : {"categories._id" : objectID}}},
        (err, docs) => {
            if(err || docs == null){
                res.json({"Error": (docs != null)? err:"Docs is null"})
            } else {
                //Delete old category 
                docs.departments[0].categories.id(objectID).remove( rErr => {
                    if(rErr) res.json({"Error": rErr});
                });
                //Add new category
                docs.departments[0].categories.push(new Category(req.body));

                //Save Docs
                docs.save((cErr, cRes) => {
                    if(cErr) res.json({"Error":err});
                    else res.json({"Message" : `Category ${req.body.name} updated`});
                });
            }
        }
    );
});

//DELETE
router.delete("/:catID", (req, res) =>{
    //Delete category
    const objectID = mongoose.Types.ObjectId(req.params.catID);
    Organization.findOne(
        {"departments.categories._id" : objectID},
        {"departments" : {$elemMatch : {"categories._id" : objectID}}},
        (err, docs) => {
            if(err || docs == null){
                res.json({"Error": (docs != null)? err:"Docs is null"})
            } else {
                //Delete category
                const name = docs.departments[0].categories.id(objectID).name;
                docs.departments[0].categories.id(objectID).remove( rErr => {
                    if(rErr) res.json({"Error": rErr});
                }); 
                //Save Docs
                docs.save((cErr, cRes) => {
                    if(cErr) res.json({"Error":err});
                    else res.json({"Message" : `Category ${name} deleted`});
                });
            }
        }
    );
});

//GET ALL
router.get("/:catID/items", (req, res) => {
    //Return every item within an category
    const catID = mongoose.Types.ObjectId(req.params.catID);
    Organization.findOne(
        {"departments.categories._id" : catID},
        {"departments" : {$elemMatch : {"categories._id" : catID}}},
        (err, docs) => {
            if(err || docs == null){
                res.json({"Error": (docs != null)? err:"Docs is null"})
            } else {
                res.json(docs.departments[0].categories.id(catID).items);
            }
        }
    )
});

//POST
router.post("/:catID/items", (req, res) =>{
    //Create a new item
    const catID = mongoose.Types.ObjectId(req.params.catID);
    Organization.findOne(
        {"departments.categories._id" : catID},
        {"departments" : {$elemMatch : {"categories._id" : catID}}},
        (err, docs) => {
            if(err || docs == null){
                res.json( {"Error": (docs != null)? err:"Docs return null."})
            } else {
                //Push new item
                docs.departments[0].categories.id(catID).items.push(new Item(req.body));
                //Save Docs
                docs.save( (iErr, iRes) => {
                    if (iErr) res.json({"Error":iErr});
                    else res.json({"Message" : `Item ${req.body.name} created successfully.`});
                })
            }
        }
    )
});

//Exports
module.exports = router;
