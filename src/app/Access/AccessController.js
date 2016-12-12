'use strict';

angular.module('zw201612')
.controller('Access.login', function($rootScope, $scope, $http, zwUtils){
	$scope.errFn = function($form){
		var $img = angular.element('#img-verify', $form);
		$img.attr('src', $img.attr('src') + '1');
	}
})

.controller('Access.register', function($rootScope, $scope, $http, zwUtils){
	var btn = document.getElementById('get-auth-code');
	var mobile = document.getElementById('mobile');
	zwUtils.yanzheng(mobile,btn,false);
})

.controller('Access.reset_pwd', function($rootScope, $scope, $http, zwUtils){
	var btn = document.getElementById('get-auth-code');
	var mobile = document.getElementById('mobile');
	zwUtils.yanzheng(mobile,btn,true);
});