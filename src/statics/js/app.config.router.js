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
            resolve:load(['validate', G.public + 'app/Access/AccessController.js'])
        })
        .state('Access.login', {
            title:'客户登录',
            url: '/login',
            templateUrl: tpl('app/Access/login.html'),
            resolve:load(['validate', G.public + 'app/Access/AccessController.js'])
        })
        .state('Access.reset_pwd', {
            title:'重置密码',
            url: '/reset_pwd',
            templateUrl: tpl('app/Access/reset_pwd.html'),
            resolve:load(['validate', G.public + 'app/Access/AccessController.js'])
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
            resolve:load([G.public + 'app/Customer/CustomerController.js'])
		})
        .state('Customer.edit', {
            title:'客户信息',
            url: '/edit',
            templateUrl: tpl('app/Customer/edit.html'),
            resolve:load(['validate', G.public + 'app/Customer/CustomerController.js'])
        })
        .state('Customer.file_cat', {
            title:'客户资料',
            url: '/file_cat',
            templateUrl: tpl('app/Customer/file_cat.html'),
            resolve:load([G.public + 'app/Customer/CustomerController.js'])
        })
        .state('Customer.file_upload', {
            title:'资料上传',
            url: '/file_upload',
            templateUrl: tpl('app/Customer/file_upload.html'),
            resolve:load([G.public + 'app/Customer/CustomerController.js'])
        });

    function tpl(url){
        return G.public + url + '?v=' + G.version;
    }
	function load(a,b){return{deps:["$ocLazyLoad","$q",function(g,d){var c=d.defer();var h=c.promise;a=angular.isArray(a)?a:a.split(/\s+/);var f=[];angular.forEach(a,function(i){if(JQ_CONFIG[i]){i=JQ_CONFIG[i]
    }else{if(MODULE_CONFIG[i]){i=MODULE_CONFIG[i]}}if(i instanceof Array){f=f.concat(i)}else{f.push(i)}});var e=function(i){if(i.length<1){c.resolve();return false}(function(k,j){g.load(k.shift()).then(function(){j(k)
    })})(i,e)};e(f);return b?h.then(function(){return b()}):h}]}};
}]);