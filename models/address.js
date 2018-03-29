import mongoose from 'mongoose'

const { Schema } = mongoose;

const addressSchema = new Schema({
    id: Number,
    address: String,
    phone: String,
    user_id: Number,
    name: String,
    postCode: String,
    idDefault: {type: Boolean, default: false},
})

addressSchema.index({id: 1});

const Address = mongoose.model('Address', addressSchema);

export default Address;