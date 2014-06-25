'use strict';

(function() {
	// Posts Controller Spec
	describe('Posts Controller Tests', function() {
		// Initialize global variables
		var PostsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Posts controller.
			PostsController = $controller('PostsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Post object fetched from XHR', inject(function(Posts) {
			// Create sample Post using the Posts service
			var samplePost = new Posts({
				name: 'New Post'
			});

			// Create a sample Posts array that includes the new Post
			var samplePosts = [samplePost];

			// Set GET response
			$httpBackend.expectGET('posts').respond(samplePosts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.posts).toEqualData(samplePosts);
		}));

		it('$scope.findOne() should create an array with one Post object fetched from XHR using a postId URL parameter', inject(function(Posts) {
			// Define a sample Post object
			var samplePost = new Posts({
				name: 'New Post'
			});

			// Set the URL parameter
			$stateParams.postId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/posts\/([0-9a-fA-F]{24})$/).respond(samplePost);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.post).toEqualData(samplePost);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Posts) {
			// Create a sample Post object
			var samplePostPostData = new Posts({
				name: 'New Post'
			});

			// Create a sample Post response
			var samplePostResponse = new Posts({
				_id: '525cf20451979dea2c000001',
				name: 'New Post'
			});

			// Fixture mock form input values
			scope.name = 'New Post';

			// Set POST response
			$httpBackend.expectPOST('posts', samplePostPostData).respond(samplePostResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Post was created
			expect($location.path()).toBe('/posts/' + samplePostResponse._id);
		}));

		it('$scope.update() should update a valid Post', inject(function(Posts) {
			// Define a sample Post put data
			var samplePostPutData = new Posts({
				_id: '525cf20451979dea2c000001',
				name: 'New Post'
			});

			// Mock Post in scope
			scope.post = samplePostPutData;

			// Set PUT response
			$httpBackend.expectPUT(/posts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/posts/' + samplePostPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid postId and remove the Post from the scope', inject(function(Posts) {
			// Create new Post object
			var samplePost = new Posts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Posts array and include the Post
			scope.posts = [samplePost];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/posts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePost);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.posts.length).toBe(0);
		}));
	});
}());