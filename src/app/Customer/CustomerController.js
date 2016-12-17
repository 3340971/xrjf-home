'use strict';


angular.module('zw201612')


.controller('Customer.my_loan', function($scope ,  $http ,  $state, zwUtils){
  	$http.get('/index.php?m=ProxyCustomer&a=getLoginCustomerLoans')
		.then(function(response){
			if(response.data.code){
				$scope.loan_list = response.data.data;
				console.log(response.data.data);
            }else{
            	zwUtils.msg('error', response.data.message);
            }
		});
})


.controller('Customer.file_cat', function($scope ,  $http ,  $state, $stateParams, zwUtils){
	var apply_id = $stateParams.apply_id;
	$http.get('/index.php?m=ProxyCustomer&a=getLoginCustomerFiles&apply_id=' + apply_id)
		.then(function(response){
			if(response.data.code){
				$scope.cat_files = response.data.data.cat_files;
				$scope.id 	     = response.data.data.contract_id;
				console.log(response.data.data);
            }else{
            	zwUtils.msg('error', response.data.message);
            }
		});
});