import mongoose from 'mongoose'

const { Schema } = mongoose;

const addressSchema = new Schema({
    address_id: Number,
    address: String,
    phone: String,
    user_id: Number,
    name: String,
    postCode: String,
    isDefault: {type: Boolean, default: false},
})


const Address = mongoose.model('Address', addressSchema);

export default Address; 