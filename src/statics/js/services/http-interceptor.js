angular.module('http.interceptor',[])
.factory('httpInterceptor', function($localStorage, $q, $rootScope, zwUtils){
	return {
		request: function(config){
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        //if($localStorage.Authorization){
          config.headers['Authorization'] = $localStorage.Authorization || 'Customer ';
        //}
        config.transformRequest.push(function(data) {
              //把JSON数据转换成字符串形式
              return typeof data == 'string' ? data : zwUtils.http_build_query(data);
        });
        return config;
    },
    response: function(response) {
        var deferred = $q.defer();
        if(response.data.code == 401){
          $rootScope.$emit("userIntercepted","notLogin",response);
          deferred.reject(response);
        }else{
          deferred.resolve(response);
        }
        return deferred.promise;
    }
	}
});