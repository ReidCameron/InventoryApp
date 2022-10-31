const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    auth_id: {
        type: String,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    organization_ids: Array,
});

const User = mongoose.model('User', userSchema);
module.exports = {User, userSchema};