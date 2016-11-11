var app = angular.module('minmax', []);

// https://minmax-server.herokuapp.com/register/'

app.controller("MinMaxCtrl", function ($scope, $http) {
    $scope.formData = {};

    $scope.onSubmit = function () {
        $http.post("https://minmax-server.herokuapp.com/register/", $scope.formData)
            .success(function(res){
                console.log(":)")
            })
            .error(function(res){
                console.log(":(")
            });
    };
});