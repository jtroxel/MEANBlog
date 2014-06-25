'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var posts = require('../../app/controllers/posts');

	// Posts Routes
	app.route('/posts')
		.get(posts.list)
		.post(users.requiresLogin, posts.create);

	app.route('/posts/:postId')
		.get(posts.read)
		.put(users.requiresLogin, posts.hasAuthorization, posts.update)
		.delete(users.requiresLogin, posts.hasAuthorization, posts.delete);

	// Finish by binding the Post middleware
	app.param('postId', posts.postByID);
};