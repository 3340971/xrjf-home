'use strict';

app
.run(['$location','$rootScope','$state',function($location, $rootScope, $state){
	$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {  
		$rootScope.title = '星融金服' + (toState.title ? ('-'+toState.title) : '');
    });
    $rootScope.$on('$viewContentLoaded', function(event){
        $(".J-validate").each(function(){
            $(this).validate({
                submitHandler:function(form){
                    var callback = $(form).attr('submitBefore');
                    if( !callback || eval(callback)(form) ){
                        form.submit();
                    }
                }
            });
        });
    });
    $rootScope.submit = function(e, route, cb){
    	e.stopPropagation();
  		e.preventDefault();
  		$rootScope.authError = null;
    	var $form = angular.element(e.target).closest('form');
    	var url = $form.attr('action');
    	if( !$form.valid() ){$rootScope[cb](99);
			return false;
		}
		$http.post(url, myUtils.serialize(myform))
			.then(function(response) {
				if ( !response.data.code ) {
			  		$rootScope.authError = response.data.msg;
			  		$rootScope[cb]($form);
				}else{
			  		$state.go(route);
				}
			}, function(x) {
				$rootScope.authError = 'Server Error';
				$rootScope[cb]($form);
			});
    }
}])
.config(['$httpProvider', function($httpProvider){

}]);