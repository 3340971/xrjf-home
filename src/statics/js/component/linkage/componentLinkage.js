//张伟
(function($,window){
	var componentLinkage = function(name, conf, bindInput){
		if(!(this instanceof componentLinkage)){
            return new componentLinkage(name, conf, bindInput);
        }
        this.type = 'linkage';
        var instance = this._getInstance(name);
	    if(instance){
	        return instance;
	    }
        
        this.conf = conf || {
        	fields:{"data[province]":'省份',"data[city]":'城市',"data[area]":'区县'},
        	dataUrl:'',
        	rootPid:0,
        	parentNode : bindInput.parentNode //挂载点
        };
        if(!this.conf.parentNode) this.conf.parentNode = bindInput.parentNode;

        ComponentBase.call(this, name, this.conf);

		this.input = bindInput;
		this.pids = [];//当前已选中值.通过length属性可以得到当前的level
		this.values = [];//当前已选中值
		var titleHtml = [],
			bodyHtml = [],
			formHtml = [],
			level = 0;
		for(var i in this.conf.fields){
			//level从0开始计数
			titleHtml.push('<li data-level="' + level + '" class="level-' + level + '">' + this.conf.fields[i] + '</li>');
			bodyHtml.push('<div data-level="' + level + '" class="level-' + level + '"></div>');
			formHtml.push('<input data-level="' + level + '" class="level-' + level + '" name="' + i + '" type="hidden" />');
			level++;
		}
		var tpl =   '<ul>'
						+ titleHtml.join('') + 
					'</ul>' +
					'<span title="关闭" class="close" >×</span>' +
					bodyHtml.join('') +
					formHtml.join('') ;
		this.component.append(tpl);
		this._init();
		return this;
	}
	componentLinkage.prototype = $.extend(ComponentBase.prototype, {
		cache : {},
		_init:function(){
			$(this.conf.parentNode).append(this.component);
			//this.component.insertAfter(this.input);
			this._bindEvent();
			this._showTab(this.conf.rootPid,0);
		},
		//显示tab面板
		_showTab:function(pid,level){
			var d = this._getBtns(pid),
				_this = this;
			$.when(d).done(function(html){
				if(html){
					_this.component
						.find('div.level-' + level).addClass('active').html(html)
						.siblings('div').removeClass('active');
					_this.component
						.find('div.level-' + level).nextAll().html('');
					_this.component
						.find('li.level-' + level).addClass('active')
						.siblings('li').removeClass('active');
					
				}else{
					_this._linkageEnd(_this.pids, _this.values);
					_this.close();
				}
			});
			return this;
		},
		_linkageChange:function(pids,values){

		},
		linkageOnChange:function(fn){
			this._linkageChange = fn;//对象实例化后,这个会赋值给对象,而不是覆盖原型链上的方法
			return this;
		},
		_linkageEnd:function(pids,values){

		},
		linkageOnEnd:function(fn){
			this._linkageEnd = fn;
			return this;
		},
		_linkageClose:function(pids,values){

		},
		linkageOnClose:function(fn){
			this._linkageClose = fn;
			return this;
		},
		//关闭组件
		close:function(){
			if(false !== this._linkageClose(this.pids,this.values)){
				this.component.trigger('onLeave');
			}
			return this;
		},
		//获取按钮
		_getBtns:function(pid){
			var dtd = $.Deferred();
			pid = pid || this.conf.rootPid;
			var id = this.pids.join('-') + '_childs', 
				_this = this;
			if( typeof this.cache[id] == 'undefined' ){
				var dtd2 = $.ajax({
					url:_this.conf.dataUrl,
					cache:true
					//data:{pid:pid}
				});
				//  dtd2.always(function(response){
				// 		var arr = [],
				//		data = eval(response.responseText);
				// 		for(var i in data){
				// 			arr.push('<a data-id="' + data[i].id + '" data-name="' + data[i].name + '">' + data[i].name + '</a>');
				// 		}
				// 		_this.cache[id] = arr.join('');
				// 		dtd.resolve(_this.cache[id]);
				// });
				dtd2.always(function(response){
					var arr = [],
						data = eval(response.responseText || response);
					if( _this.pids.length == 0 ){
						for(var i in data){
							if(data[i].name == '请选择')continue;
							arr.push('<a data-id="' + data[i].name + '" data-value="' + data[i].name + '">' + data[i].name + '</a>');
						}
					}
					if( _this.pids.length == 1 ){
						for(var i in data){
							if(data[i].name == pid){
								var childs = data[i].cityList;
								for(var j in childs){
									if(childs[j].name == '请选择')continue;
									arr.push('<a data-id="' + childs[j].name + '" data-value="' + childs[j].name + '">' + childs[j].name + '</a>');
								}
							}
							
						}
					}
					if( _this.pids.length == 2 ){
						for(var i in data){
							if(data[i].name == _this.pids[0]){
								var citys = data[i].cityList;
								for(var j in citys){
									if(citys[j].name == _this.pids[1]){
										var childs = citys[j].areaList;
										for(var k in childs){
											if(childs[k].name == '请选择')continue;
											arr.push('<a data-id="' + childs[k] + '" data-value="' + childs[k] + '">' + childs[k] + '</a>');
										}
									}
								}
							}
							
						}
					}
					_this.cache[id] = arr.join('');
					dtd.resolve(_this.cache[id]);
				});
			}else{
				dtd.resolve(_this.cache[id]);
			}
			return dtd.promise();
		},
		//绑定事件
		_bindEvent:function(){
			var _this = this;
			this.component.on('click','div a',function(e){
				//当前所在level
				var level = $(this).parent().data('level');
				$(this).addClass('active').siblings('a').removeClass('active');
				var pid = $(this).data('id');
				var value = $(this).data('value');
				_this.pids = _this.pids.slice(0,level);
				_this.pids.push(pid);
				_this.values = _this.values.slice(0,level);
				_this.values.push(value);
				_this.component.find('input:hidden').val('');
				//更新隐藏域表单
				for(var i = 0; i <= level; i++){
					_this.component.find('input.level-'+ i +':hidden').val(_this.pids[i]);
				}
				_this._linkageChange(_this.pids,_this.values);
				_this._showTab(pid,level+1);//显示下一个tab
				return false;
			});
			this.component.on('click','.close',function(e){
				_this.close();
			});
			this.component.on('click','li',function(e){
				var level = $(this).data('level');
				if( level > _this.pids.length ) return false;
				_this.component
					.find('div.level-' + level).addClass('active')
					.siblings('div').removeClass('active');
				_this.component
					.find('li.level-' + level).addClass('active')
					.siblings('li').removeClass('active');
			});
		}
	});
	window.componentLinkage = componentLinkage;
})(jQuery,window);