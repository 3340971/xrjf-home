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
	$scope.apply_id = $stateParams.apply_id;
  	$http.get('/index.php?m=ProxyCustomer&a=getLoginCustomerApply&apply_id=' + $scope.apply_id)
    		.then(function(response){
    			if(response.data.code){
    				if($localStorage.customer_id != response.data.data.customer.customer_id){
						zwUtils.msg('error', '数据异常,请重新登录');
						$rootScope.login_out();
		            }else{
						$scope.customer = response.data.data.customer || {};
						$scope.profession = response.data.data.customer_profession || {};
						$scope.profession.start_work_date = new Date($scope.profession.start_work_date * 1000);
						$scope.asset = response.data.data.customer_asset || {};
						$scope.contact = response.data.data.customer_contact || {};
						$scope.contract = response.data.data.contract || {};
						$scope.apply_id = response.data.data.apply_id;
		            }
    			}
    	});
})


.controller('Customer.loan_plan', function($scope , $rootScope,  $http ,  $state, $stateParams, $localStorage, zwUtils){
	$scope.apply_id = $stateParams.apply_id;
	if(!$scope.apply_id){
		zwUtils.msg('error', '参数丢失');
		return false;
	}
  	$http.get('/index.php?m=ProxyCustomer&a=loan_plan&apply_id=' + $scope.apply_id)
    		.then(function(response){
    			if(response.data.code){
    				$scope.list = response.data.data;
    			}else{
    				zwUtils.msg('error', response.data.message);
    			}
    	});
})


.controller('Customer.loan_audit', function($scope , $rootScope,  $http ,  $state, $stateParams, $localStorage, zwUtils){
	$scope.apply_id = $stateParams.apply_id;
  	if(!$scope.apply_id){
		zwUtils.msg('error', '参数丢失');
		return false;
	}
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


.controller('Customer.tongDun', function($scope ,  $http ,  $state, $stateParams, $q, zwUtils, zwTongdun){
	var processingEl = angular.element('#processing')[0];

	function reset(){
		$scope.vars = {};
		$scope.isLogin = true;
		$scope.sms_code_need = false;
		$scope.auth_code_need = false;
		$scope.auth_code_src = '';
		$scope.task_id = '';
	}

	reset();

	$scope.login = function(){
		processingEl.style.display = 'block';
		zwTongdun.login($scope.vars.server_pwd, function(code, message, data){console.log(code, message, data);
			processingEl.style.display = 'none';
			if(code === false){
				reset();
				zwUtils.msg('error', message);
			}else{
				//$scope.$apply(function(){
					$scope.isLogin = false;
					if(code == 0){
						$state.go('success');
						return;
					}
					$scope.sms_code_need = data.sms_code_need;
					$scope.auth_code_need = data.auth_code_need;
					$scope.auth_code_src = data.auth_code_src;
				//});
				$scope.task_id = data.task_id;
				zwUtils.msg('info', message);
			}
		});
	};
	$scope.next = function(){
		processingEl.style.display = 'block';
		zwTongdun.next($scope.task_id, $scope.vars.sms_code, $scope.vars.auth_code, function(code, message, data){
			processingEl.style.display = 'none';
			if(code === false){
				reset();
				zwUtils.msg('error', message);
			}else{
				//$scope.$apply(function(){
					if(code == 0){
						$state.go('success');
						return;
					}
					$scope.sms_code_need = data.sms_code_need;
					$scope.auth_code_need = data.auth_code_need;
					$scope.auth_code_src = data.auth_code_src;
				//});
				zwUtils.msg('info', message);
			}
		});
	};
	
});