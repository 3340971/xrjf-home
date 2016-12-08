'use strict';

app
.run(['$location','$rootScope','$state','$stateParams','zwUtils',function($location, $rootScope, $state, $stateParams, zwUtils){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.stateCash = [];
    $rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
        $rootScope.stateCash.push([toState.name, toParams]);
        $rootScope.title = '星融金服' + (toState.title ? ('-'+toState.title) : '');
    });  
    $rootScope.back = function() {
        if($rootScope.stateCash.length < 2)return false;
        $rootScope.stateCash.pop();
        var last = $rootScope.stateCash.pop();
        $state.go(last[0], last[1]);  
    };
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $rootScope.loading = true;
    });
    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
        $state.go('Access.404');
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
                },
                onfocusout:function(element) { $(element).valid(); },
                errorClass:"invalid",
                errorElement:"em",
                errorPlacement:function(error,element) {
                    error[0].textContent && zwUtils.msg('error',error[0].textContent);
                    element.closest('.weui-cell').addClass('weui-cell_warn');
                },
                success: function ( label, element ) {
                    $(element).closest('.weui-cell').removeClass('weui-cell_warn');
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
            if(elementBottom > viewBottom){
                document.body.scrollTop = elementBottom - window.innerHeight - 50;
            }
        }
        
    });
}])
.config(['$httpProvider', '$locationProvider', function($httpProvider, $locationProvider){
	$httpProvider.interceptors.push('httpInterceptor');
    //$locationProvider.html5Mode(true);
}]);