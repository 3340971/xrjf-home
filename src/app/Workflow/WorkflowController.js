'use strict';


angular.module('zw201612')

.controller('Workflow.apply',
  [       '$scope', '$http', '$state', '$stateParams', '$localStorage', 'zwUtils',
  function($scope ,  $http ,  $state,   $stateParams,   $localStorage,   zwUtils){
  	var cat_id = $stateParams.cat_id;
  	//获取产品期限
  	$http.get('/index.php?m=ProxyAccess&a=getProducts&cat_id=' + cat_id)
  		.then(function(response){
  			if(response.data.code){
  				$scope.products = response.data.data;
  			}
  		});
    $scope.next = function(){
      if(!$localStorage.apply_price){
        zwUtils.msg('error', '请填写申请金额'); return false;
      }
      if(!$localStorage.product_id){
        zwUtils.msg('error', '请选择贷款期限'); return false;
      }
      $state.go('Workflow.add_customer');
    }
}])

.controller('Workflow.add_customer', function($scope , $rootScope,  $http ,  $state,   $localStorage,   zwUtils){
    $scope.submitCf = function(re, data, $form){
      if(re){
        delete $localStorage.apply_price;
        delete $localStorage.product_id;
      }
    }
  	$http.get('/index.php?m=ProxyCustomer&a=getLoginCustomer')
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
              $scope.current_apply_id = response.data.data.current_apply_id;
            }
    			}
    		});
});