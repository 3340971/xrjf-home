'use strict';
angular.module('zw.tongdun',[])
.factory('zwTongdun',function($http, $q, $interval){
/*********** fns start *************/
	var obj = {
		login : function (pwd, fn) {
		    var task_id,
		    	url ="/index.php?m=ProxyCustomer&a=tongDun";
			$http.post(url, "mobile_pwd="+pwd)
				.then(function(response) {
					if(response.data.code == 0){
						fn(false, response.data.message, []);
					}else{
						var data = response.data.data.data;
						var task_id = data.task_id;
						obj.query(task_id).then(
							function(vars){
								fn(vars[0],vars[1],vars[2]);
							},
							function(vars){
								fn(vars[0],vars[1],vars[2]);
							});
					}
				});
		},
		query : function(task_id){
			var defererd = $q.defer();
			var url = '/index.php?m=ProxyCustomer&a=tongDunQuery&id=' + task_id;
			var timer = setInterval(function(){
				$http.get(url)
					.then(function(response){
						//失败
						if(response.data.code == 0){
							clearInterval(timer);
							defererd.reject([false, response.data.message, []]);
							return ;
						}
						//铜盾的返回
						var code = response.data.data.code,
						 	message = response.data.data.message,
						 	data = response.data.data.data;
						if(code != 100){
							clearInterval(timer);
							if(data.next_stage){console.log(data.fields);
								data.sms_code_need  = data.fields.sms_code  ? true : false;
								data.auth_code_need = data.fields.auth_code ? true : false;
								data.auth_code_src  = data.auth_code;
							}
							defererd.resolve([code, message, data]);
			            }
					});
			}, 3500);
			return defererd.promise;
		},
		next : function(task_id, sms_code, auth_code, fn){
			sms_code  = sms_code  || '';
			auth_code = auth_code || '';
			var url = '/index.php?m=ProxyCustomer&a=tongDunStage&id=' + task_id;
			$http.post(url, "sms_code="+sms_code+"&auth_code="+auth_code)
				.then(function(response) {
					obj.query(task_id).then(
						function(vars){
							fn(vars[0],vars[1],vars[2]);
						},
						function(vars){
							fn(vars[0],vars[1],vars[2]);
						});
				});
		}
	};

	return obj;
});
