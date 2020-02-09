/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
	/*
	 * ----[EXAMPLE TEST]----
	 * Each test should completely test the response of the API end-point including response status code!
	 */
	// test('#example Test GET /api/books', function(done) {
	// 	chai.request(server)
	// 		.get('/api/books')
	// 		.end(function(err, res) {
	// 			assert.equal(res.status, 200);
	// 			assert.isArray(res.body, 'response should be an array');
	// 			assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
	// 			assert.property(res.body[0], 'title', 'Books in array should contain title');
	// 			assert.property(res.body[0], '_id', 'Books in array should contain _id');
	// 			done();
	// 		});
	// });
	/*
	 * ----[END of EXAMPLE TEST]----
	 */

	suite('Routing tests', function() {
		suite('POST /api/books with title => create book object/expect book object', function() {
			test('Test POST /api/books with title', function(done) {
				chai.request(server)
					.post('/api/books')
					.send({
						title: 'someNewTitle'
					})
					.end((err, res) => {
						if (err) {
							console.log(err);
						}
						assert.equal(res.body.title, 'someNewTitle');
						assert.equal(res.body.comments[0], undefined);
						done();
					});
			});

			test('Test POST /api/books with no title given', function(done) {
				chai.request(server)
					.post('/api/books')
					.send()
					.end((err, res) => {
						if (err) {
							console.log(err);
						}
						assert.equal(res.body.message, 'Please indicate a title.');
						done();
					});
			});
		});

		suite('GET /api/books => array of books', function() {
			test('Test GET /api/books', function(done) {
				chai.request(server)
					.get('/api/books')
					.end(function(err, res) {
						assert.equal(res.status, 200);
						assert.isArray(res.body, 'response should be an array');
						assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
						assert.property(res.body[0], 'title', 'Books in array should contain title');
						assert.property(res.body[0], '_id', 'Books in array should contain _id');
						done();
					});
			});
		});

		suite('GET /api/books/[id] => book object with [id]', function() {
			test('Test GET /api/books/[id] with id not in db', function(done) {
				chai.request(server)
					.get('/api/books/ikuggy878')
					.end((err, res) => {
						assert.equal(res.text, 'no book exists');
						done();
					});
			});

			test('Test GET /api/books/[id] with valid id in db', function(done) {
				chai.request(server)
					.post('/api/books')
					.send({
						title: 'someNewTitle'
					})
					.end((err, res) => {
						if (err) {
							return console.log(err);
						}
						let x = res.body._id;
						chai.request(server)
						.get(`/api/books/${x}`)
						.end((err, res) => {
							if (err) {
								return console.log(err);
							}
							assert.equal(x, res.body._id);
							done()
						})
					});
			});
		});

		suite('POST /api/books/[id] => add comment/expect book object with id', function() {
			test('Test POST /api/books/[id] with comment', function(done) {
				chai.request(server)
					.post('/api/books')
					.send({
						title: 'someNewTitle'
					})
					.end((err, res) => {
						if (err) {
							return console.log(err);
						}
						let x = res.body._id;
						chai.request(server)
						.post(`/api/books/${x}`)
						.send({
							comment: 'someInterestingComment'
						})
						.end((err, res) => {
							if (err) {
								return console.log(err);
							}
							assert.equal('someInterestingComment', res.body.comments[0]);
							done()
						})
					});
			});
		});
		suite('DELETE /api/books/ with and without [id]', () => {
			test('DELETE /api/books complete delete', (done) => {
				chai.request(server)
				.delete('/api/books')
				.end((err, res) => {
					assert.equal(res.body.message, 'complete delete successful');
					done()
				})
			})
			test('DELETE /api/books/[id] single', (done) => {
				chai.request(server)
				.post('/api/books')
				.send({
					title: 'some title'
				})
				.end((err, res) => {
					if (err) {
						return console.log(err)
					}
					let x = res.body._id;
					chai.request(server)
					.delete(`/api/books/${x}`)
					.end((err, res) => {
						if (err) {
							return console.log(err);
						}
						assert.equal(res.text, 'delete successful');
						done();
					})
				})
			})
		})
	});
});
