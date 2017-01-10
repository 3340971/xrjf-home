//张伟
app
.directive('zwConst', function($http){
	return {
		restrict:'E',
		replace:true,
		scope:{
			selected:"=myModel"
		},
		template:'<select {{exts}}><option>--请选择--</option></select>',
		link:function(scope, element, attrs){
			scope.exts = attrs.exts;
			var constType = attrs.constType;
			var name = attrs.name;
			var class_str = attrs.class;
			var disabled = attrs.disabled === 'true' ? true : false;
			var url = G.host + '/index.php?m=ProxyAccess&a=consts&const_type='+constType;
			$http.get(url).then(function(response){
				var list = response.data.data;
				var options = '';
				for(var i in list){
					var temp = i == scope.selected ? 'selected' : '';
					options += '<option value="'+i+'" '+temp+'>'+list[i]+'</option>';
				}
				element.attr('name',name)
						.attr('class',class_str)
						.prop('disabled',disabled)
						.append(options);
			});
		}
	};
});