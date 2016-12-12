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
        .state('Access.404', {
            title:'404 Err',
            url: '/404',
            templateUrl: tpl('app/Access/404.html')
        })
        .state('Access.register', {
            title:'客户注册',
            url: '/register',
            templateUrl: tpl('app/Access/register.html'),
            resolve:load(['validate', 'app/Access/AccessController.js'])
        })
        .state('Access.login', {
            title:'客户登录',
            url: '/login',
            templateUrl: tpl('app/Access/login.html'),
            resolve:load(['validate', 'app/Access/AccessController.js'])
        })
        .state('Access.reset_pwd', {
            title:'重置密码',
            url: '/reset_pwd',
            templateUrl: tpl('app/Access/reset_pwd.html'),
            resolve:load(['validate', 'app/Access/AccessController.js'])
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
            resolve:load(['app/Customer/CustomerController.js'])
		})
        .state('Customer.edit', {
            title:'客户信息',
            url: '/edit',
            templateUrl: tpl('app/Customer/edit.html'),
            resolve:load(['validate', 'app/Customer/CustomerController.js'])
        })
        .state('Customer.file_cat', {
            title:'客户资料',
            url: '/file_cat',
            templateUrl: tpl('app/Customer/file_cat.html'),
            resolve:load(['app/Customer/CustomerController.js'])
        })
        .state('Customer.file_upload', {
            title:'资料上传',
            url: '/file_upload',
            templateUrl: tpl('app/Customer/file_upload.html'),
            resolve:load(['app/Customer/CustomerController.js'])
        });

    function tpl(url){
        return G.public + url + '?v=' + G.version;
    }
	function load(srcs, callback) {
        return {
            //deps 是自己命名的,能被注入到控制器
            //属性值是一个返回 promise 值的函数
            deps: ['$ocLazyLoad', '$q', function( $ocLazyLoad, $q ){
                var deferred = $q.defer();
                var promise  = deferred.promise;
                srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                var files = [];
                //angular.forEach 是一个同步执行的函数
                angular.forEach(srcs, function(src){
                    if(JQ_CONFIG[src]){
                        src = JQ_CONFIG[src];
                    }else if(MODULE_CONFIG[src]){
                        src = MODULE_CONFIG[src];
                    }
                    if(src instanceof Array){
                        files = files.concat(src);
                    }else{
                        files.push(src);
                    }
                });
                //严格模式下不能用arguments.callee了,所以这里不能用匿名函数
                var fn = function (files){
                    if(files.length < 1){
                        deferred.resolve();
                        return false;
                    }
                    (function(files, fn){
                        $ocLazyLoad.load( G.public + files.shift() + '?v=' + G.version ).then(function(){
                            fn(files);
                        });
                    })(files, fn);
                }
                fn(files);
                return callback ? promise.then(function(){ return callback(); }) : promise;
            }]
        };
    }
}]);