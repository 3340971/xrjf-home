'use strict';

app
.run([  '$location','$rootScope','$state','$stateParams','$http','$localStorage','zwUtils',
function($location,  $rootScope,  $state,  $stateParams,  $http,  $localStorage,  zwUtils){
    $rootScope.$state = $state;
    $rootScope.$storage = $localStorage;
    $rootScope.$stateParams = $stateParams;
    var processingEl = angular.element('#processing')[0];
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
        processingEl.style.display = 'block';
        if(toState.name.split('.')[0] != 'Access' && !$localStorage.Authorization){
            zwUtils.msg('error','未登录');
            event.preventDefault();//必须
            $state.go('Access.login');
            return false;
        }
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        processingEl.style.display = 'none';
    });
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
        processingEl.style.display = 'none';
    });


    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
        processingEl.style.display = 'none';
        $state.go('404');
    });
    $rootScope.$on('$viewContentLoaded', function(event){
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
    $rootScope.$on('userIntercepted',function(emitInfo, errorType, response){
        if(errorType == 'notLogin'){
            zwUtils.msg('error',response.data.message);
            $localStorage.$reset();
            $state.go("Access.login",{from:$state.current.name,w:errorType});
        }
    });
    $rootScope.submit = function(e, route, cb){
    	e.stopPropagation();
  		e.preventDefault();
    	var $form = angular.element(e.target).closest('form');
    	var url = $form.attr('action');
    	if( !$form.valid() ){
			return false;
		}
        zwUtils.msg('success','正在提交...');
		$http.post(url, zwUtils.serialize($form[0]))
			.then(function(response) {
				if ( !response.data.code ) {
                    zwUtils.msg('error',response.data.message);
			  		cb && cb(false, response.data.data, $form);
				}else{
                    zwUtils.msg('success', response.data.message || '提交成功');
                    cb && cb(true, response.data.data, $form);
                    if(route && route != '') $state.go(route);
				}
			}, function(x) {
				$rootScope.authError = 'Server Error';
				cb && cb(false, response.data.data, $form);
			});
    }
    $rootScope.login_out = function(e){
        e && e.stopPropagation();
        e && e.preventDefault();
        $http.post('/index.php?m=ProxyAccess&a=login_out')
            .then(function(response) {
                //delete $localStorage.Authorization;
                $localStorage.$reset();
                $state.go('Access.login');
            });
    }
    document.documentElement.addEventListener('contextmenu', function(e){
        e.preventDefault();
    }, false);
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