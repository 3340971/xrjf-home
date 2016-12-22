'use strict';


angular.module('zw201612')


.controller('Customer.my_loan', function($scope ,  $http ,  $state, $stateParams, $localStorage, zwUtils){
	var apply_status = $stateParams.status || '';
  	$http.get('/index.php?m=ProxyCustomer&a=getLoginCustomerLoans&apply_status='+apply_status)
		.then(function(response){
			if(response.data.code){
				$scope.loan_list = response.data.data;
            }else{
            	zwUtils.msg('error', response.data.message);
            }
		});
})


.controller('Customer.loan_detail', function($scope , $rootScope,  $http ,  $state, $stateParams, $localStorage, zwUtils){
	$rootScope.backState = 'Customer.my_loan';
	var apply_id = $stateParams.apply_id;
  	$http.get('/index.php?m=ProxyCustomer&a=getLoginCustomerApply&apply_id=' + apply_id)
    		.then(function(response){
    			if(response.data.code){
    				if($localStorage.customer_id != response.data.data.customer.customer_id){
						zwUtils.msg('error', '数据异常,请重新登录');
						$rootScope.login_out();
		            }else{
						$scope.customer = response.data.data.customer;
						$scope.profession = response.data.data.customer_profession;
						$scope.profession.start_work_date = new Date($scope.profession.start_work_date * 1000);
						$scope.asset = response.data.data.customer_asset;
						$scope.contact = response.data.data.customer_contact;
						$scope.contract = response.data.data.contract;
						$scope.apply_id = response.data.data.apply_id;console.log($scope.apply_id);
		            }
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
            }else{
            	zwUtils.msg('error', response.data.message);
            }
		});
})


.controller('Customer.tongDun', function($scope ,  $http ,  $state, $stateParams, zwUtils){
	$scope.submitCf = function(re, data, $form){
      if(re){
        $state.go('Customer.tongDunStage', {id:data.id});
      }
    }
})


.controller('Customer.tongDunStage', function($scope ,  $http ,  $state, $stateParams, zwUtils){
	//获取当前进度
	$http.get('/index.php?m=ProxyCustomer&a=tongDunStage&id=' + $stateParams.id)
		.then(function(response){
			if(response.data.code){
				$scope.cat_files = response.data.data.cat_files;
				$scope.id 	     = response.data.data.contract_id;
            }else{
            	zwUtils.msg('error', response.data.message);
            }
		});
});