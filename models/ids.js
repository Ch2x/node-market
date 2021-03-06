import mongoose from 'mongoose';

const { Schema } = mongoose;

const idsSchema = new Schema({
	user_id: Number,
	product_id: Number,
	img_id: Number,
	comment_id: Number,
	cart_id: Number,
	address_id: Number,
	buy_id: Number,
	sort_id: Number,
});

const Ids = mongoose.model('Ids', idsSchema);


Ids.findOne((err, data) => {
	if (!data) {
		const newIds = new Ids({
			product_id: 0,
			user_id: 0,
			number: 0,
			img_id: 0,
			comment_id: 0,
			cart_id: 0,
			address_id: 0,
			buy_id: 0,
			sort_id: 0,
		});
		newIds.save();
	}
})

export default Ids;