'use strict';


angular.module('zw201612')


.controller('Customer.index.my_loan',
  [       '$scope', '$http', '$state',
  function($scope ,  $http ,  $state){

}])


.controller('Customer.file_cat', function($scope ,  $http ,  $state, zwUtils){
	$http.get('/index.php?m=ProxyCustomer&a=getLoginCustomerFile')
		.then(function(response){
			if(response.data.code){
				$scope.file_cats = response.data.data;
				console.log(response.data.data);
            }else{
            	zwUtils.msg('error', response.data.message);
            }
		});
});