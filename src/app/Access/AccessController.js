'use strict';

angular.module('zw201612')
.controller('Access.login', function($rootScope, $scope, $http, $state, $localStorage, zwUtils){
	if($localStorage.Authorization) $state.go('Access.index.product_cats');
	$scope.submitCf = function(re, data, $form){
		if(re){
			$localStorage.Authorization = data.jwt;
			$localStorage.customer_id = data.customer_id;
			$localStorage.mobile = data.mobile;
		}else{
			var $img = angular.element('#img-verify', $form);
			$img.attr('src', $img.attr('src') + '1');
		}
	}
})

.controller('Access.register', function($rootScope, $scope, $http, $state, $localStorage, zwUtils){
	if($localStorage.Authorization) $state.go('Access.index.product_cats');
	var btn = document.getElementById('get-auth-code');
	var mobile = document.getElementById('mobile');
	zwUtils.yanzheng(mobile,btn,false);
})

.controller('Access.reset_pwd', function($rootScope, $scope, $http, $state, $localStorage, zwUtils){
	if($localStorage.Authorization) $state.go('Access.index.product_cats');
	var btn = document.getElementById('get-auth-code');
	var mobile = document.getElementById('mobile');
	zwUtils.yanzheng(mobile,btn,true);
})


.controller('Access.index.product_cats',
  [       '$scope', '$http', '$state',
  function($scope ,  $http ,  $state){
  	//获取产品列表
  	$http.get('/index.php?m=ProxyAccess&a=getProductCats')
  		.then(function(response){
  			if(response.data.code){
  				$scope.list = response.data.data;
  			}
  		});
}]);