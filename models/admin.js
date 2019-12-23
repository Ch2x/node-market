import mongoose from 'mongoose';

const { Schema } = mongoose;

const adminSchema = new Schema({
    uesrName: String,
    password: String,
})

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;