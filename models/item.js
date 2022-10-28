const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    item_code:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    custom_attributes: Map
}, { autoCreate : false });

const Item = mongoose.model('Item', itemSchema);
module.exports = {Item, itemSchema};
