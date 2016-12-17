'use strict';

app
.config([
			'$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG',
	function($stateProvider,   $urlRouterProvider,   JQ_CONFIG,   MODULE_CONFIG){
	$urlRouterProvider.otherwise('/Access/product_cats');
	$stateProvider
        .state('Access', {
            abstract: true,
            url: '/Access',
            templateUrl: tpl("app/layout.html") //layout
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
        .state('Access.product_cats', {
            title:'贷款申请',
            url: '/product_cats',
            templateUrl: tpl('app/Access/product_cats.html'),
            resolve:load(['app/Access/AccessController.js'])
        })


		.state('Customer', {
			abstract: true,
            url: '/Customer',
            templateUrl: tpl("app/layout.html") //layout
		})
        .state('Customer.my_loan', {
            title:'我的贷款',
            url: '/my_loan',
            templateUrl: tpl('app/Customer/my_loan.html'),
            resolve:load(['app/Customer/CustomerController.js'])
        })
        .state('Customer.file_cat', {
            title:'客户资料',
            url: '/file_cat?apply_id',
            templateUrl: tpl('app/Customer/file_cat.html'),
            resolve:load(['app/Customer/CustomerController.js'])
        })
        .state('Customer.file_upload', {
            title:'资料上传',
            url: '/file_upload',
            templateUrl: tpl('app/Customer/file_upload.html'),
            resolve:load(['app/Customer/CustomerController.js'])
        })
        //工作流
        .state('Workflow', {
            abstract: true,
            url: '/Workflow',
            templateUrl: tpl("app/layout.html") //layout
        })
        .state('Workflow.apply', {
            title:'贷款申请',
            url: '/apply?cat_id&cat_name',
            templateUrl: tpl('app/Workflow/apply.html'),
            resolve:load(['validate', 'app/Workflow/WorkflowController.js'])
        })
        .state('Workflow.add_customer', {
            title:'基本信息',
            url: '/add_customer',
            templateUrl: tpl('app/Workflow/add_customer.html'),
            resolve:load(['validate', 'app/Workflow/WorkflowController.js'])
        });

    function tpl(url){
        return G.public + url + '?v=' + G.version;
    }
	function load(b,d){return{deps:["$ocLazyLoad","$q",function(h,k){var e=k.defer(),f=e.promise;b=angular.isArray(b)?b:b.split(/\s+/);var c=[];angular.forEach(b,function(a){JQ_CONFIG[a]?a=JQ_CONFIG[a]:MODULE_CONFIG[a]&&(a=MODULE_CONFIG[a]);a instanceof Array?c=c.concat(a):c.push(a)});var g=function(a){if(1>a.length)return e.resolve(),!1;(function(a,b){h.load(G.public+a.shift()+"?v="+G.version).then(function(){b(a)})})(a,g)};g(c);return d?f.then(function(){return d()}):f}]}};
}]);