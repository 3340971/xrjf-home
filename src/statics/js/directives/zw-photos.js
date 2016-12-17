app
.directive('zwPhotos', function($rootScope, $q, $ocLazyLoad, $localStorage){
	return {
		restrict:'A',
		//scope:true,
		link:function(scope, element, attrs){
			//相册数据
			var imgs  = eval(attrs.files);
			var title = attrs.title;
			var cat_id = attrs.catid;
			var contract_id = attrs.contractid;
			var server = attrs.server;///index.php?m=file&a=proxy_add_contract

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
					var c = componentPhotos('photos'+cat_id, {
									componentsUri : '/xrjf-home/src/statics/js/component/',
									httpHeader   : {
										"Authorization":$localStorage.Authorization || 'ProxyCustomer '
									},//附加的http头
						        	server: server,
									title:title,
									css:{left:0,top:'0px',transition:'.3s'},
									animateIn:{transform:'scale3d(1,1,1)'},
									animateOut:{transform:'scale3d(0,0,1)'},
									parentNode:false,
									cols:3,
									imgs:imgs,
									formData:{
										id:contract_id,
								        type:cat_id,
								        r:'proxy_contract_file'
									},
									deleteCallback:deleteCallback,
									successCallback:successCallback,
								})
								.show();
				});
				function successCallback(li, response){
					console.log(response);
					li.setAttribute('img-id', response.data.adds[0].file_id);
					element.find('span').text(response.data.count);
				}
				function deleteCallback(li, parentNode){
					var id = li.getAttribute('img-id');
					alert(id);
				}
			});
		}
	};
});
