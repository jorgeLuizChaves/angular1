var app = angular.module('codecraft', ['ngResource',
	'infinite-scroll', 'angularSpinner', 'angular-ladda', 'jcs-autoValidate']);



app.controller('PersonDetailController', function ($scope, ContactService) {
	$scope.contacts = ContactService;
});

app.controller('PersonListController', function ($scope, ContactService) {

	$scope.search = "";
	$scope.order = "email";
	$scope.contacts = ContactService;
	
	
	$scope.loadMore = function () {
		console.log("load more!");
		$scope.contacts.loadMore();
	}

	// $scope.sensitiveSearch = function (person) {
	// 	if ($scope.search) {
	// 		return person.name.indexOf($scope.search) == 0 ||
	// 			person.email.indexOf($scope.search) == 0;
	// 	}
	// 	return true;
	// };

	$scope.$watch('search', function (newValue, oldValue) {
		console.log("new value = " + newValue );
		console.log("old value = " + oldValue );
		$scope.contacts.doSearch(newValue);
	});

	$scope.$watch('order', function (oldValue, newValue) {


		$scope.contacts.doOrder(newValue);
	});

});

app.config(function($httpProvider, $resourceProvider){
	var codeCraftAPIToken = 'Token 207e43c143c055265a4c21218d707dc768f2319f';
	$httpProvider.defaults.headers.common['Authorization'] = codeCraftAPIToken;
	$resourceProvider.defaults.stripTrailingSlashes = false;
});


app.factory("Contact", function ($resource) {
	return $resource("https://codecraftpro.com/api/samples/v1/contact/:id");
});

app.service('ContactService', function (Contact) {


	var self = {
		'addPerson': function (person) {
			this.persons.push(person);
		},
		'selectedPerson': null,
		'persons': [],
		'hasMore': true,
		'isLoading': false,
		'page': 1,
		'search': null,
		'doSearch': function (search) {
			self.hasMore = true;
			self.page = 1;
			self.persons = [];
			self.search = search;
			self.loadContacts();
		},
		'doOrder': function (order) {
			self.hasMore = true;
			self.page = 1;
			self.persons = [];
			self.ordering = order;
			self.loadContacts();
		},
		'loadMore': function(){
			if(self.hasMore && !self.isLoading){
				self.page +=1;
				self.loadContacts();
			}
		},
		'loadContacts': function(){
			if(self.hasMore && !self.isLoading){
				self.isLoading = true;

				var params = {
					"page": self.page,
					"search": self.search,
					"ordering": self.ordering
				};

				Contact.get(params, function (data) {
					console.log(" data: ${data}");
					angular.forEach(data.results, function (person) {
						self.persons.push(new Contact(person));
					});

					if(!data.next){
						self.hasMore = false;
					}

					self.isLoading = false;
				});
			}

		}
	};

	self.loadContacts();

	return self;

});