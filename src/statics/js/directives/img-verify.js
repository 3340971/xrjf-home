app.directive('imgVerify', function(){
	return {
		restrict:'E',
		replace:true,
		template:'<img src="{{src}}" ng-click="refresh()" />',
		link:function(scope, element, attrs){
			scope.refresh = function(){
				scope.src = 'http://192.168.1.250/index.php?m=user&a=verifycode&_t='+ new Date().getTime();
			};
			scope.refresh();
		}
	};
});