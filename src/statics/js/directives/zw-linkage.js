//张伟
app
.directive('zwLinkage', function($rootScope, $q, $ocLazyLoad){
	return {
		restrict:'A',
		scope:true,
		link:function(scope, element, attrs){
			var urls = {
				city : G.public + 'statics/js/component/linkage/data.json',
			};
			if(attrs.fields){
				attrs.fields = window.JSON.parse(attrs.fields);
			}else{
				attrs.fields = {};
			}
			var conf = {
				fields:  attrs.fields,
				dataUrl: urls[attrs.typekey],
				rootPid:0,
				css:{left:0,top:'4.4rem',transition:'.3s'},
				animateIn:{transform:'scale3d(1,1,1)'},
				animateOut:{transform:'scale3d(0,0,1)'},
				parentNode : element.closest('.weui-cell')[0]
			};
			var deferred = $q.defer();
			if(typeof componentLinkage == 'undefined'){
				$ocLazyLoad.load([
					G.public + 'statics/js/component/linkage/componentLinkage.js',
					G.public + 'statics/js/component/linkage/linkage.css'
				]).then(function(){
                    deferred.resolve();
                });
			}else{
				deferred.resolve();
			}
			deferred.promise.then(function(){
				var name = Math.random().toString().replace('.','_');
				element.on('click', function (e) {
					var c = componentLinkage(name, conf, element[0])
						.linkageOnChange(function(pids,values){
							element.val(values.join(','));
						})
						.linkageOnEnd(function(pids,values){
							//element.trigger('blur');
						})
						.linkageOnClose(function(pids,values){
							//if(pids.length < 3)return false;
							element.trigger('blur');
						})
						.show();
				});
			});
		}
	};
});
