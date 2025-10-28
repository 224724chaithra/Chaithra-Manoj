import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	genre: { type: String, required: true },
	price: { type: Number, required: true },
	stock: { type: Number, default: 0 },
	publishedYear: { type: Number },
	createdAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);
export default Book;