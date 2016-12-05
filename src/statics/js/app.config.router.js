'use strict';

app
.config([
			'$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG',
	function($stateProvider,   $urlRouterProvider,   JQ_CONFIG,   MODULE_CONFIG){
	$urlRouterProvider.otherwise('/Access/login');
	$stateProvider
        .state('Access', {
            abstract: true,
            url: '/Access',
            templateUrl: tpl("app/layout_access.html") //layout
        })
        .state('Access.register', {
            title:'客户登记',
            url: '/register',
            templateUrl: tpl('app/Access/register.html'),
            resolve:load(['validate', G.root + 'app/Access/AccessController.js'])
        })
        .state('Access.login', {
            title:'客户登录',
            url: '/login',
            templateUrl: tpl('app/Access/login.html'),
            resolve:load(['validate', G.root + 'app/Access/AccessController.js'])
        })

		.state('Customer', {
			abstract: true,
            url: '/Customer',
            templateUrl: tpl("app/layout.html") //layout
		})
		.state('Customer.index', {
            title:'',
            url: '/index',
            templateUrl: tpl('app/Customer/index.html'),
            resolve:load([G.root + 'app/Customer/CustomerController.js'])
		});

    function tpl(url){
        return G.root + url + '?v=' + G.version;
    }


	function load(srcs, callback) {
        return {
            deps: ['$ocLazyLoad', '$q', function( $ocLazyLoad, $q ){
                var deferred = $q.defer();
                var promise  = false;
                srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                if(!promise){
                    promise = deferred.promise;
                }
                angular.forEach(srcs, function(src) {
                    promise = promise.then( function(){
                        if(JQ_CONFIG[src]){
                            src = JQ_CONFIG[src];
                        }else if(MODULE_CONFIG[src]){
                            src = MODULE_CONFIG[src];
                        }
                        return $ocLazyLoad.load(src);
                    });
                });
                deferred.resolve();
                return callback ? promise.then(function(){ return callback(); }) : promise;
            }]
        };
    }

}]);