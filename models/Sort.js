import mongoose from 'mongoose';

const { Schema } = mongoose;

const sortSchema = new Schema({
    sort_id: Number,
    sortName: String,
})

const Sort = mongoose.model('Sort', sortSchema);

export default Sort;