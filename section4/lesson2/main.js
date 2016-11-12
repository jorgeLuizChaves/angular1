var app = angular.module('codecraft', []);

app.controller('ParentController', function ($scope, $rootScope) {
	$rootScope.name = "Root";

	$scope.reset = function () {
		$rootScope.name = "Parent";
	};

});

app.controller('ChildController', function ($scope, $rootScope) {
});


