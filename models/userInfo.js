const userInfoSchema = new Schema({
    avatar: {type: String, default: 'default.jpg'},
    registered_time: String,
    id: Number,
    user_id: Number,
    userName: String,
    moblie: {type: Number, default: ''},
})

module.exports = mongoose.model('UserInfo', userInfoSchema);