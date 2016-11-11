var app = angular.module('minmax', ['jcs-autoValidate']);

app.run([
	'defaultErrorMessageResolver',
	function (defaultErrorMessageResolver) {
		// passing a culture into getErrorMessages('fr-fr') will get the culture specific messages
		// otherwise the current default culture is returned.
		defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
			errorMessages['myCustomError'] = 'My custom error message';
			errorMessages['myFieldRequired'] = 'OMG this field is required';
			errorMessages['anotherErrorMessage'] = 'An error message with the attribute value {0}';
		});
	}
]);




app.controller('MinMaxCtrl', function ($scope, $http) {
	$scope.formModel = {};

	$scope.onSubmit = function () {
			console.log("Hey i'm submitted!");
			console.log($scope.formModel);

			$http.post('https://minmax-server.herokuapp.com/register/', $scope.formModel).
				success(function (data) {
					console.log(":)")
				}).error(function(data) {
					console.log(":(")
				});

	};
});