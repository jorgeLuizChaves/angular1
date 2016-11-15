var app = angular.module('codecraft',
	['ngResource',
		'infinite-scroll',
		'angularSpinner',
		'angular-ladda',
		'jcs-autoValidate',
		'mgcrea.ngStrap',
		'toaster',
		'ngAnimate']);



app.controller('PersonDetailController', function ($scope, ContactService) {
	$scope.contacts = ContactService;

	$scope.updateContact = function(){
		$scope.contacts.updateContact($scope.contacts.selectedPerson);
	}

	$scope.deleteContact = function () {
		$scope.contacts.deleteContact($scope.contacts.selectedPerson);
	}
});

app.controller('PersonListController', function ($scope, $modal, ContactService) {

	$scope.search = "";
	$scope.order = "email";
	$scope.contacts = ContactService;

	$scope.showModalCreateContact = function(){
		$scope.contacts.selectedPerson = {};
		$scope.createModal = $modal({
			scope: $scope,
			title: 'New Contact',
			template: 'template/modal.create.tpl.html',
			show: true
		});
	};

	$scope.createContact = function(){
		$scope.contacts.createContact($scope.contacts.selectedPerson).then(function(){
			$scope.createModal.hide();
		});
	};
	
	$scope.loadMore = function () {
		console.log("load more!");
		$scope.contacts.loadMore($scope.contacts.selectedPerson);
	}

	$scope.$watch('search', function (newValue, oldValue) {
		console.log("new value = " + newValue );
		console.log("old value = " + oldValue );
		$scope.contacts.doSearch(newValue);
	});

	$scope.$watch('order', function (oldValue, newValue) {
		$scope.contacts.doOrder(newValue);
	});

});

app.config(function($httpProvider, $resourceProvider, laddaProvider, $datepickerProvider){
	var codeCraftAPIToken = 'Token 207e43c143c055265a4c21218d707dc768f2319f';
	$httpProvider.defaults.headers.common['Authorization'] = codeCraftAPIToken;
	$resourceProvider.defaults.stripTrailingSlashes = false;
	laddaProvider.setOption({
		style: 'expand-right'
	});

	angular.extend($datepickerProvider.defaults, {
		dateFormat: 'd/M/yyyy',
		autoclose: true
	});
});


app.factory("Contact", function ($resource) {
	return $resource("https://codecraftpro.com/api/samples/v1/contact/:id/", {id: '@id'}, {
		update: {
			method: 'PUT'
		}
	});
});

app.service('ContactService', function (Contact, $q, toaster) {


	var self = {
		'addPerson': function (person) {
			this.persons.push(person);
		},
		'selectedPerson': null,
		'persons': [],
		'hasMore': true,
		'isLoading': false,
		'isUpdating': false,
		'page': 1,
		'search': null,
		'createContact': function(person){
			console.log("creating a new contact");
			var d = $q.defer();
			self.isSaving = true;
			Contact.save(person).$promise.then(function(){
				self.isSaving = false;
				self.selectedPerson = null;
				self.hasMore = true;
				self.page = 1;
				self.persons = [];
				self.loadContacts();
				d.resolve();
				toaster.pop("success", "contact created with success", "contact " + person.name + " created");

			});
			return d.promise;
		},
		'updateContact': function (person) {
			console.log("saving changes");
			self.isUpdating = true;
			//internal resource
			person.$update().then(function () {
				self.isUpdating = false;
				toaster.pop("success", "contact changed with success", "contact " + person.name + " updated");
			});
		},
		'deleteContact': function(person){
			self.isDeleting = true;
			var index = self.persons.indexOf(person);
			person.$remove().then(function () {
				var deleteCount = 1;
				self.persons.splice(index, deleteCount);
				self.isDeleting = false;
				self.selectedPerson = null;
				toaster.pop("success", "contact deleted with success", "contact " + person.name + " deleted");

			});
		},
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