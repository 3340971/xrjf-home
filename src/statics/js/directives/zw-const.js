//张伟
app
.directive('zwConst', function($http){
	return {
		restrict:'E',
		replace:true,
		scope:{
			selected:"=myModel"
		},
		template:'<select><option>--请选择--</option></select>',
		link:function(scope, element, attrs){
			var constType = attrs.constType;
			var url = G.host + '/index.php?m=ProxyAccess&a=consts&const_type='+constType;
			$http.get(url).then(function(response){
				var list = response.data.data;
				var options = '';
				for(var i in list){
					var temp = i == scope.selected ? 'selected' : '';
					options += '<option value="'+i+'" '+temp+'>'+list[i]+'</option>';
				}
				element.append(options);
			});
		}
	};
});