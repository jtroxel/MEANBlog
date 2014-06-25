'use strict';

// Posts controller
angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts',
	function($scope, $stateParams, $location, Authentication, Posts ) {
		$scope.authentication = Authentication;

		// Create new Post
		$scope.create = function() {
			// Create new Post object
			var post = new Posts ({
				name: this.name
			});

			// Redirect after save
			post.$save(function(response) {
				$location.path('posts/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Post
		$scope.remove = function( post ) {
			if ( post ) { post.$remove();

				for (var i in $scope.posts ) {
					if ($scope.posts [i] === post ) {
						$scope.posts.splice(i, 1);
					}
				}
			} else {
				$scope.post.$remove(function() {
					$location.path('posts');
				});
			}
		};

		// Update existing Post
		$scope.update = function() {
			var post = $scope.post ;

			post.$update(function() {
				$location.path('posts/' + post._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Posts
		$scope.find = function() {
			$scope.posts = Posts.query();
		};

		// Find existing Post
		$scope.findOne = function() {
			$scope.post = Posts.get({ 
				postId: $stateParams.postId
			});
		};
	}
]);