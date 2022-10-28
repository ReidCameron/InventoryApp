const mongoose = require('mongoose');
const { departmentSchema } = require('./department');
const Schema = mongoose.Schema;

const organizaitonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner_id:{
        type: String, //{user-id}
        required: true
    },
    departments: [ departmentSchema ],
    users: {
        type: Map,
        required: true
    } //{user-id: permision level}
});

const Organization = mongoose.model('Organization', organizaitonSchema);
module.exports = {Organization, organizaitonSchema};
