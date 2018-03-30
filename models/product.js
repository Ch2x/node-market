import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
    product_id: Number,
    user_id: Number,
    title: String,
    description: String,
    price: Number,
    sort: String,
    images: [],
    releaseTime: String,
    isBuy: {type: Boolean, default: false},
});

const Product = mongoose.model('Product', productSchema);

export default Product;