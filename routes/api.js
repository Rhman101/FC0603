/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const Book = require('./../models/book');

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

module.exports = function(app) {
	app.route('/api/books')
		.get(async (req, res) => {
			let books = await Book.find({});
			let booksArray = books
				.map((elem) => elem.toObject())
				.map((elem) => {
					return {
						_id: elem._id,
						title: elem.title,
						_v: elem._v,
						commentcount: elem.comments.length
					};
				});
			res.json(booksArray);
		})

		.post(async (req, res) => {
			if (!req.body.title) {
				return res.json({
					message: 'Please indicate a title.'
				});
			}
			var title = req.body.title;
			let book = new Book({
				title
			});
			await book.save();
			res.json(book);
		})

		.delete(async (req, res) => {
			try {
				await Book.deleteMany();
				res.json({
					message: 'complete delete successful'
				});
			} catch (e) {
				return console.log(e);
			}
		});

	app.route('/api/books/:id')
		.get(async (req, res) => {
			var bookid = req.params.id;
			try {
				let book = await Book.findById(req.params.id);
				res.json(book);
			} catch (e) {
				res.send('no book exists')
			}
		})

		.post(async (req, res) => {
			var bookid = req.params.id;
			var comment = req.body.comment;
			try {
				let book = await Book.findById(bookid);
				book.comments.push(comment);
				await book.save();
				res.json(book);
			} catch (e) {
				console.log(e);
			}
		})

		.delete(async (req, res) => {
			var bookid = req.params.id;
			try {
				await Book.findByIdAndRemove(bookid);
				res.send('delete successful')
			} catch (e) {
				return console.log(e);
			}
		});
};
