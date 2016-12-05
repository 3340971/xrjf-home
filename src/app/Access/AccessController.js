'use strict';

angular.module('zw201612')
.controller('Access.login', function($rootScope, $scope, $http){
	$scope.errFn = function($form){
		var $img = angular.element('#img-verify', $form);
		$img.attr('src', $img.attr('src') + '1');
	}
})


.controller('Access.register', function($rootScope, $scope, $http){

});