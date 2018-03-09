import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: Number,
    userName: String,
    password: String,
})

const User = mongoose.model('User', userSchema);

export default User