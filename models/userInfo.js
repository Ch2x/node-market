const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
    avatar: {type: String, default: 'default.jpg'},
    registered_time: String,
    id: Number,
    user_id: Number,
    userName: String,
    moblie: {type: Number, default: ''},
})

const UserInfo = mongoose.model('UserInfo', userInfoSchema);

export default UserInfo