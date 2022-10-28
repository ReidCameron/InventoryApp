const mongoose = require('mongoose');
const { itemSchema } = require('./item');
const Schema = mongoose.Schema;
// const itemSchema = require('./model').item.itemSchema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    items: [ itemSchema ], //[ itemSchema ], //list of items schemas/objects
    users: Map
}, { autoCreate : false });

const Category = mongoose.model('Category', categorySchema );
module.exports = {Category, categorySchema};
