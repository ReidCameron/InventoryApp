const express = require('express');
const mongoose = require('mongoose');
const { Item } = require('../models/item');
const { Organization } = require('../models/organization');

//Item Router
const router = express.Router();

//Reusable Aggregation Pipeline
function getPipeline(itemID) { 
    return [
        {'$match' : {'departments.categories.items._id': itemID }}, //match org
        {'$unwind': '$departments'}, 
        {'$unwind': '$departments.categories'},
        {'$match' : {'departments.categories.items._id': itemID}}, //match cat
        {'$unwind': '$departments.categories.items'},
        {'$match' : {'departments.categories.items._id': itemID}}, //match item
    ];
};

//GET 1
router.get("/:itemID", (req, res) =>{
    //Return item that matches itemID
    const itemID = mongoose.Types.ObjectId(req.params.itemID);
    Organization.aggregate(
        getPipeline(itemID).concat({'$project':{'_id': 0, 'departments.categories.items': 1}}) ,
        (err, docs) => {
            if(err || docs[0] == null){
                res.json( {"Error": (docs[0] != null)? err:"Docs return null."})
            } else {
                res.json(docs[0].departments.categories.items)
            }
        }
    )
});

//PUT (update)
router.put("/:itemID", (req, res) =>{
    //Update item fields
    const itemID = mongoose.Types.ObjectId(req.params.itemID);
    Organization.aggregate( 
        getPipeline(itemID).concat({'$project':{'_id': 1, 'departments._id' : 1,
            'departments.categories._id' : 1, 'departments.categories.items._id' : 1}}),
        (err, docs) => {
            if(err || docs[0] == null){
                res.json( {"Error": (docs[0] != null)? err:"Docs return null."})
            } else {
                Organization.updateOne({ 'departments.categories.items._id': itemID },
                    { $set : { "departments.$[dep].categories.$[cat].items.$[item]" : new Item(req.body)}},
                    { arrayFilters: [ 
                        { "dep._id": docs[0].departments._id },
                        { "cat._id": docs[0].departments.categories._id },
                        { "item._id": itemID }  
                    ]},
                    (err, docs) => {
                        if (err || docs == null) res.json( {"Error": (docs != null)? err:"Docs return null."})
                        else res.json({"Message": docs});
                    }
                )
            }
        }
    );
});

//DELETE
router.delete("/:itemID", (req, res) =>{
    //Delete item
    const itemID = mongoose.Types.ObjectId(req.params.itemID);
    Organization.aggregate( 
        getPipeline(itemID).concat({'$project':{'_id': 1, 'departments._id' : 1,
            'departments.categories._id' : 1, 'departments.categories.items._id' : 1}}),
        (err, docs) => {
        if(err || docs[0] == null){
            res.json( {"Error": (docs[0] != null)? err:"Docs return null."})
        } else {
            Organization.findOne({ 'departments.categories.items._id': itemID },
                {'departments.categories.items._id' : 1, 'departments.categories._id' : 1,
                 'departments._id' : 1},
                (err, docs2) => {
                    if (err || docs2 == null) res.json( {"Error": (docs2 != null)? err:"Docs return null."})
                    else{
                        const depID = docs[0].departments._id
                        const catID = docs[0].departments.categories._id
                        docs2.departments.id(depID).categories.id(catID).items.id(itemID).remove()
                        docs2.save((iErr, iRes) => {
                            if (iErr) res.json({"Error":iErr})
                            else res.json({"Message": "Item deleted succesffully."});
                        });
                    }
                }
            )
        }
    });
});

//Exports
module.exports = router;
