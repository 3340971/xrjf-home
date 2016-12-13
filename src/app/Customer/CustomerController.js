'use strict';


angular.module('zw201612')


.controller('Customer.index.my_loan',
  [       '$scope', '$http', '$state',
  function($scope ,  $http ,  $state){

}])

.controller('Customer.apply_add',
  [       '$scope', '$http', '$state', '$stateParams',
  function($scope ,  $http ,  $state,   $stateParams){
  	var cat_id = $stateParams.cat_id;
  	//获取产品期限
  	$http.get('/index.php?m=ProxyAccess&a=getProducts&cat_id=' + cat_id)
  		.then(function(response){
  			if(response.data.code){
  				$scope.products = response.data.data;
  			}
  		});
}])

.controller('Customer.edit',
  [       '$scope', '$http', '$state',
  function($scope ,  $http ,  $state){
  	$http.get('/index.php?m=ProxyWorkflow&a=add_customer')
  		.then(function(response){
  			if(response.data.code){
  				$scope.products = response.data.data;
  			}
  		});
}]);