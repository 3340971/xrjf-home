//张伟
(function($,window){
	var componentLinkage = function(element,conf){
		if(!(this instanceof componentLinkage)){
            return new componentLinkage(element,conf);
        }
        if(!(element instanceof jQuery)){
			element = jQuery(element);
		}
		var name = this._readXPath(element[0]);
		name = encodeURIComponent(name);
        var instance = this._getInstance(name);
        if(instance){
        	return instance;
        }console.log(name);
        this.$selectorEl = element;
		this.conf = conf || {fields:{"data[province]":'省份',"data[city]":'城市',"data[area]":'区县'},dataUrl:'',rootPid:0};
		this.id = ('c_' + Math.random()).replace('.','_');
		this.cache = [];
		this.pids = [];
		this.values = [];
		this.$wrap = null;
		var titleHtml = [],
			bodyHtml = [],
			formHtml = [],
			level = 0;
		for(var i in this.conf.fields){
			titleHtml.push('<li data-level="' + level + '" class="level-' + level + '">' + this.conf.fields[i] + '</li>');
			bodyHtml.push('<div data-level="' + level + '" class="level-' + level + '"></div>');
			formHtml.push('<input data-level="' + level + '" class="level-' + level + '" name="' + i + '" type="hidden" />');
			level++;
		}
		this.tpl = '<div class="component-linkage component-linkage-' + name + '" id="' + this.id + '" style="display:none">\
						<span title="关闭" class="close" >×</span>\
						<ul>'
							+ titleHtml.join('') + 
						'</ul>' +
						bodyHtml.join('') +
						formHtml.join('') +
					'</div>';
		this._init();
		this._setInstance(name);
	}
	componentLinkage.prototype = {
		_instances:[],
		_init:function(){
			$('body').append(this.tpl);
			this.$wrap = $('#' + this.id);
			this._bindEvent();
			this._showTab(this.conf.rootPid,0);
			return this;
		},
		_readXPath : function (element) {
		    var ix= 0, siblings = [];
		    if(element.tagName == 'HTML'){
		    	return 'HTML';
		    }else{
		    	siblings = element.parentNode.childNodes;
		    	for (var i= 0,l=siblings.length; i<l; i++) {
			        var sibling= siblings[i];
			        if (sibling==element){
			            return this._readXPath(element.parentNode)+'/'+element.tagName+((ix+1)==1?'':'['+(ix+1)+']');
			        }else if(sibling.nodeType==1 && sibling.tagName==element.tagName){
			            ix++;
			        }
			    }
		    }
		},
		_setInstance:function(name){
			this._instances[name] = this;
		},
		_getInstance:function(name){
			return typeof this._instances[name] == 'undefined' ? false : this._instances[name];
		},
		_showTab:function(pid,level){
			var d = this._getBtns(pid),
				_this = this;
			$.when(d).done(function(html){
				if(html){
					_this.$wrap
						.find('div.level-' + level).addClass('active').html(html)
						.siblings('div').removeClass('active');
					_this.$wrap
						.find('div.level-' + level).nextAll().html('');
					_this.$wrap
						.find('li.level-' + level).addClass('active')
						.siblings('li').removeClass('active');
					
				}else{
					_this._linkageEnd(_this.pids,_this.values);
					_this.close();
				}
			});
			return this;
		},
		_linkageChange:function(pids,values){

		},
		linkageOnChange:function(fn){
			this._linkageChange = fn;
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
		//显示组件
		show:function(){
			var pos = this.$selectorEl.position();
			var top = pos.top + this.$selectorEl.outerHeight();
			this.$wrap.css({top:top + 'px',left:pos.left + 'px'}).show();
			return this;
		},
		//关闭组件
		close:function(){console.log(this.pids,this.values);
			//this._showTab(this.conf.rootPid,0);
			if(false !== this._linkageClose(this.pids,this.values)){
				this.$wrap.hide();
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
						data = eval(response.responseText);
					if( _this.pids.length == 0 ){
						for(var i in data){
							arr.push('<a data-id="' + data[i].name + '" data-value="' + data[i].name + '">' + data[i].name + '</a>');
						}
					}
					if( _this.pids.length == 1 ){
						for(var i in data){
							if(data[i].name == pid){
								var childs = data[i].cityList;
								for(var j in childs){
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
			this.$wrap.on('click','div a',function(e){
				//当前所在level
				var level = $(this).parent().data('level');
				$(this).addClass('active').siblings('a').removeClass('active');
				var pid = $(this).data('id');
				var value = $(this).data('value');
				_this.pids = _this.pids.slice(0,level);
				_this.pids.push(pid);
				_this.values = _this.values.slice(0,level);
				_this.values.push(value);
				_this.$wrap.find('input:hidden').val('');
				//更新隐藏域表单
				for(var i = 0; i <= level; i++){
					_this.$wrap.find('input.level-'+ i +':hidden').val(_this.pids[i]);
				}
				_this._linkageChange(_this.pids,_this.values);
				_this._showTab(pid,level+1);//显示下一个tab
				return false;
			});
			this.$wrap.on('click','.close',function(e){
				_this.close();
			});
			this.$wrap.on('click','li',function(e){
				var level = $(this).data('level');
				if( level > _this.pids.length ) return false;
				_this.$wrap
					.find('div.level-' + level).addClass('active')
					.siblings('div').removeClass('active');
				_this.$wrap
					.find('li.level-' + level).addClass('active')
					.siblings('li').removeClass('active');
			});
		}
	}
	window.componentLinkage = componentLinkage;
})(jQuery,window);