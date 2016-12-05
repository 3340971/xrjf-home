'use strict';

app
.controller('init', ['$scope', function($scope){
	$scope.loaded = true;
	$scope.title = '星融金服';
}]);

angular.bootstrap(document,["zw201612"]);