var app = angular.module('minmax', [
	'jcs-autoValidate', 'angular-ladda'
]);

app.run(function (defaultErrorMessageResolver) {
		defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
			errorMessages['tooYoung'] = 'You must be at least {0} years old to use this site';
			errorMessages['tooOld'] = 'You must be max {0} years old to use this site';
			errorMessages['badUsername'] = 'Username can only contain numbers and letters and _';
		});
	}
);


app.controller('MinMaxCtrl', function ($scope, $http) {
	$scope.formModel = {};
	$scope.submiting = false;

	$scope.onSubmit = function () {
		$scope.submiting = true;

		console.log("Hey i'm submitted!");
		console.log($scope.formModel);

		$http.post('https://minmax-server.herokuapp.com/register/', $scope.formModel).
			success(function (data) {
				console.log(":)");
			$scope.submiting = false;
			}).error(function(data) {
				console.log(":(");
			$scope.submiting = false;
			});

	};
});