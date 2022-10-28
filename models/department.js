const mongoose = require('mongoose');
const { categorySchema } = require('./category');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    categories: [ categorySchema ],
    users: Map //{user-id: permisions-level}
}, { autoCreate : false });

const Department = mongoose.model('Department', departmentSchema);
module.exports = {Department, departmentSchema};
