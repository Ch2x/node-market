import mongoose from 'mongoose'

const { Schema } = mongoose;

const commentSchema = new Schema({
    comment_id: Number,
    product_id: Number,
    content: String,
    from_uid: Number,
    to_uid: Number,
})

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;