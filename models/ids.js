import mongoose from 'mongoose';

const { Schema } = mongoose;

const idsSchema = new Schema({
    user_id: Number,
});

const Ids = mongoose.model('Ids', idsSchema);


Ids.findOne((err, data) => {
	if (!data) {
		const newIds = new Ids({
			user_id: 0,
		});
		newIds.save();
	}
})

export default Ids;