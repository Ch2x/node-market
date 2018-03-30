import mongoose from 'mongoose'

const { Schema } = mongoose;

const buySchema = new Schema({
    buy_id: Number,
    user_id: Number,
    address_id: Number,
    product_id: Number,
    buyTime: String,
});

const Buy = mongoose.model('Buy', buySchema);

export default Buy;