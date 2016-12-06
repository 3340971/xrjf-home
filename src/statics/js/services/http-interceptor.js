angular.module('http.interceptor',[])
.factory('httpInterceptor', function(zwUtils){
	return {
		'request': function(config){
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            config.transformRequest.push(function(data) {
                  //把JSON数据转换成字符串形式
                  return typeof data == 'string' ? data : zwUtils.http_build_query(data);
            });
            return config;
        }
	}
});