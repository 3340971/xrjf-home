'use strict';

app
.run(['$location','$rootScope','$state',function($location, $rootScope, $state){
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $rootScope.loading = true;
    });
    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
        $state.go('Access.404');
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $rootScope.title = '星融金服' + (toState.title ? ('-'+toState.title) : '');
    });
    $rootScope.$on('$viewContentLoaded', function(event){
        $rootScope.loading = false;
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
    	if( !$form.valid() ){
			return false;
		}
		$http.post(url, myUtils.serialize(myform))
			.then(function(response) {
				if ( !response.data.code ) {
			  		$rootScope.authError = response.data.msg;
			  		cb($form);
				}else{
			  		$state.go(route);
				}
			}, function(x) {
				$rootScope.authError = 'Server Error';
				cb($form);
			});
    }
    angular.element(window).on('resize', function(){
        if(document.hasFocus() && document.activeElement.nodeName.toLowerCase() == 'input'){
            var $element = angular.element(document.activeElement);
            var viewTop = angular.element(window).scrollTop(), 
                viewBottom = viewTop + window.innerHeight;
            var elementTop = $element.offset().top,
                elementBottom = elementTop + $element.height();
            document.activeElement.scrollIntoView();
        }
        
    });
}])
.config(['$httpProvider', function($httpProvider){
	$httpProvider.interceptors.push('httpInterceptor');
}]);