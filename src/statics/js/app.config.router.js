'use strict';

app
.config([
			'$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG',
	function($stateProvider,   $urlRouterProvider,   JQ_CONFIG,   MODULE_CONFIG){
	$urlRouterProvider.otherwise('/Customer/index');
	$stateProvider
		.state('Customer', {
			abstract: true,
            url: '/Customer',
            templateUrl: G.root + "app/layout.html" //layout
		})
		.state('Customer.index', {
            url: '/index',
            templateUrl: G.root + 'app/Customer/index.html',
            resolve:load([G.root + 'app/Customer/CustomerController.js'])
		});


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