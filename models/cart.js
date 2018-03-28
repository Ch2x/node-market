import mongoose from 'mongoose'

const { Schema } = mongoose;

const cartSchema = new Schema({
    cart_id: Number,
    user_id: Number,
    product_id: Number,
})

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;