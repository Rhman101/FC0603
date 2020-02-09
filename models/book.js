const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    comments: {
        type: Array
    }
})

const Book = new mongoose.model('Book', bookSchema);

module.exports = Book;