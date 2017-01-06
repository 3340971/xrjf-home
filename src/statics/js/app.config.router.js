'use strict';

app
.config([
			'$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG',
	function($stateProvider,   $urlRouterProvider,   JQ_CONFIG,   MODULE_CONFIG){
	$urlRouterProvider.otherwise('/Access/product_cats');
	$stateProvider
        .state('success', {
            title:'Success',
            url: '/success',
            templateUrl: tpl("app/Access/success.html")
        })
        .state('404', {
            title:'404 Err',
            url: '/404',
            templateUrl: tpl('app/Access/404.html')
        })
        .state('Access', {
            abstract: true,
            url: '/Access',
            templateUrl: tpl("app/layout.html") //layout
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
            url: '/my_loan?status',
            templateUrl: tpl('app/Customer/my_loan.html'),
            resolve:load(['app/Customer/CustomerController.js'])
        })
        .state('Customer.loan_detail', {
            title:'贷款详情',
            url: '/loan_detail?apply_id&wg',
            templateProvider:function($stateParams, $templateCache, $http, zwUtils){
                var url = tpl('app/Customer/loan_detail/' + $stateParams.wg + '.html');
                return $http.get(url, {cache: $templateCache}).then(function(response){
                    return response.data;
                },function(response){
                    if(response.status == 404){
                        zwUtils.msg('error', '模板不存在');
                    }else{
                        zwUtils.msg('error', '未知模板错误');
                    }
                    return false;
                });
            },
            resolve:load(['app/Customer/CustomerController.js'])
        })
        .state('Customer.loan_plan', {
            title:'还款计划',
            url: '/loan_plan?apply_id',
            templateUrl: tpl('app/Customer/loan_plan.html'),
            resolve:load(['app/Customer/CustomerController.js'])
        })
        .state('Customer.loan_audit', {
            title:'还款情况',
            url: '/loan_audit?apply_id',
            templateUrl: tpl('app/Customer/loan_audit.html'),
            resolve:load(['app/Customer/CustomerController.js'])
        })
        .state('Customer.file_cat', {
            title:'客户资料',
            url: '/file_cat?apply_id&allow',
            templateUrl: tpl('app/Customer/file_cat.html'),
            resolve:load(['app/Customer/CustomerController.js'])
        })
        .state('Customer.file_upload', {
            title:'资料上传',
            url: '/file_upload',
            templateUrl: tpl('app/Customer/file_upload.html'),
            resolve:load(['app/Customer/CustomerController.js'])
        })
        .state('Customer.tongDun', {
            title:'授权信息',
            url: '/tongDun',
            templateUrl: tpl('app/Customer/tongDun.html'),
            resolve:load(['validate', 'app/Customer/CustomerController.js'])
        })
        .state('Customer.tongDunStage', {
            title:'输入验证码',
            url: '/tongDunStage?id',
            templateUrl: tpl('app/Customer/tongDunStage.html'),
            resolve:load(['validate', 'app/Customer/CustomerController.js'])
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
            templateProvider:function($localStorage, $templateCache, $http, zwUtils){
                var url = tpl('app/Workflow/add_customer/' + $localStorage.wg + '.html');
                return $http.get(url, {cache: $templateCache}).then(function(response){
                    return response.data;
                },function(response){
                    if(response.status == 404){
                        zwUtils.msg('error', '模板不存在');
                    }else{
                        zwUtils.msg('error', '未知模板错误');
                    }
                    return false;
                });
            },
            resolve:load(['validate', 'app/Workflow/WorkflowController.js'])
        });

    function tpl(url){
        return G.public + url + '?v=' + G.version;
    }
	function load(b,d){return{deps:["$ocLazyLoad","$q",function(h,k){var e=k.defer(),f=e.promise;b=angular.isArray(b)?b:b.split(/\s+/);var c=[];angular.forEach(b,function(a){JQ_CONFIG[a]?a=JQ_CONFIG[a]:MODULE_CONFIG[a]&&(a=MODULE_CONFIG[a]);a instanceof Array?c=c.concat(a):c.push(a)});var g=function(a){if(1>a.length)return e.resolve(),!1;(function(a,b){h.load(G.public+a.shift()+"?v="+G.version).then(function(){b(a)})})(a,g)};g(c);return d?f.then(function(){return d()}):f}]}};
}]);