//张伟
app
.directive('zwPhotos', function($rootScope, $q, $ocLazyLoad, $localStorage, $http){
	return {
		restrict:'A',
		//scope:true,
		link:function(scope, element, attrs){
			//相册数据
			var imgs  = eval(attrs.files);
			var allowUpload  = attrs.upload === 'true' ? true : false;
			var title = attrs.title;
			var cat_id = attrs.catid;
			var contract_id = attrs.contractid;
			var server = attrs.server;///index.php?m=file&a=proxy_add_contract

			var deferred = $q.defer();
			if(typeof componentPhotos == 'undefined'){
				$ocLazyLoad.load([
					G.public + 'statics/js/component/photos/componentPhotos.js?v='+G.version,
					G.public + 'statics/js/component/photos/componentPhotos.css?v='+G.version
				]).then(function(){
                    deferred.resolve();
                });
			}else{
				deferred.resolve();
			}
			deferred.promise.then(function(){//console.log(G.public + 'statics/js/component/photos/componentPhotos.js?v='+G.version);
				var name = Math.random().toString().replace('.','_');
				element.on('click', function (e) {//console.log(componentPhotos);
					var c = componentPhotos('photos'+cat_id, {
									componentsUri : '/xrjf-home/src/statics/js/component/',
									httpHeader   : {
										"Authorization":$localStorage.Authorization || 'ProxyCustomer_'
									},//附加的http头
						        	server: server,
									title:title,
									css:{left:0,top:'0px',transition:'.3s',position:'fixed'},
									animateIn:{transform:'scale3d(1,1,1)'},
									animateOut:{transform:'scale3d(0,0,1)'},
									parentNode:false,
									cols:3,
									allowUpload:allowUpload,
									//设定单个文件大小
						            fileSingleSizeLimit: 4 * 1024 * 1024,
						            fileSizeLimit: 50 * 1024 * 1024,//[默认值：undefined] 验证文件总大小是否超出限制, 超出则不允许加入队列
						            // 上传文件个数
						            fileNumLimit : 20,
									imgs:imgs,
									formData:{
										id:contract_id,
								        type:cat_id,
								        r:'proxy_contract_file'
									},
									deleteCallback:deleteCallback,
									successCallback:successCallback
								})
								.show();
				});
				function successCallback(li, response){
					console.log(response);
					li.setAttribute('img-id', response.data.adds[0].file_id);
					li.setAttribute('src-min', response.data.adds[0].min);
					li.setAttribute('src-max', response.data.adds[0].max);
					element.find('span').text(response.data.count);
				}
				function deleteCallback(li){
					var id = li.getAttribute('img-id');
					if(id){
						var url = '/index.php?m=file&a=proxy_preview_file&action=del&r=proxy_contract_file&file_id='+id+'&id='+contract_id;
						$http.get(url, {
							headers:{"Authorization":$localStorage.Authorization || 'ProxyCustomer_'}
						})
						.success(function(){
							var oldNum = parseInt(element.find('span').text());
							element.find('span').text(oldNum-1)
						});
					}
				}
			});
		}
	};
});
