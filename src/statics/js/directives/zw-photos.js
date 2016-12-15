app
.directive('zwPhotos', function($rootScope, $q, $ocLazyLoad){
	return {
		restrict:'A',
		scope:true,
		link:function(scope, element, attrs){
			//相册数据
			var imgs = eval(attrs.files);

			var deferred = $q.defer();
			if(typeof componentLinkage == 'undefined'){
				$ocLazyLoad.load([
					G.public + 'statics/js/component/photos/componentPhotos.js',
					G.public + 'statics/js/component/photos/componentPhotos.css'
				]).then(function(){
                    deferred.resolve();
                });
			}else{
				deferred.resolve();
			}
			deferred.promise.then(function(){
				var name = Math.random().toString().replace('.','_');
				element.on('click', function (e) {
					var c = componentPhotos('photos', {
									css:{left:0,top:'24px',transition:'.3s'},
									animateIn:{transform:'scale3d(1,1,1)'},
									animateOut:{transform:'scale3d(0,0,1)'},
									parentNode:false,
									cols:3,
									imgs:imgs
								})
								.show();
				});
			});
		}
	};
});
