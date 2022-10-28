const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    auth_id: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    organization_ids: Array,
});

const User = mongoose.model('User', userSchema);
module.exports = {User, userSchema};