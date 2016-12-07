app
.directive('imgVerify', function($rootScope){
	return {
		restrict:'E',
		replace:true,
		template:'<img src="{{src}}" ng-click="refresh()" />',
		link:function(scope, element, attrs){
			scope.refresh = function(){
				scope.src = G.host + '/index.php?m=user&a=verifycode&_t='+ new Date().getTime();
			};
			scope.refresh();
		}
	};
});