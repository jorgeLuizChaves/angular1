var app = angular.module('codecraft', []);

app.controller('ParentController', function ($scope) {
	$scope.name = "Parent";

	$scope.reset = function () {
		$scope.name = "parent";
	};

});

app.controller('ChildController', function ($scope) {



});


