var app = angular.module('codecraft', ['ngResource']);



app.controller('PersonDetailController', function ($scope, ContactService) {
	$scope.contacts = ContactService;
});

app.controller('PersonListController', function ($scope, ContactService) {

	$scope.search = "";
	$scope.order = "email";
	$scope.contacts = ContactService;

	$scope.sensitiveSearch = function (person) {
		if ($scope.search) {
			return person.name.indexOf($scope.search) == 0 ||
				person.email.indexOf($scope.search) == 0;
		}
		return true;
	};

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

	Contact.get(function (data) {
		console.log(data.results);
	});


	var self = {
		'addPerson': function (person) {
			this.persons.push(person);
		},
		'selectedPerson': null,
		'persons': [],
		'hasMore': true,
		'isLoading': false,
		'loadContacts': function(){
			Contact.get(function (data) {
				console.log(data);
				angular.forEach(data.results, function (person) {
					self.persons.push(new Contact(person));
				})
			});
		}
	};

	self.loadContacts();

	return self;

});