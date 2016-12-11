/*
组件基类(父类) ComponentBase 
样式文件: ComponentBase.css
作用: 输出一个DOM,内容可以是图片或文字
原则: 不操作已存在的DOM,只返回组件
事件: 
	onLoad : 当前页载入
	onLeave : 当前页移出
 */
(function($,window){

var ComponentBase = function(name, conf){
    // 考虑到apply、call继承,这段代码不能要
    // if(!(this instanceof ComponentBase)){
    //     return new ComponentBase(name,cfg);
    // }

    var instance = this._getInstance(name);
    if(instance){
        return instance;
    }
	var options = {
		type: this.type || 'base',
		text:'',
		bg:'',
		width:'',
		height:'',
		center: false,//水平居中
		middle: false,//垂直居中
		css:{},
		animateIn:{display:'block'},//载入时的样式
		animateOut:{display:'none'},//移出时的样式
		delay:0 //延迟时间
	};
	conf = $.extend({}, options, conf);
	//给每个组件分配一个ID
    this.id = ('c_' + Math.random()).replace('.','_');
    // 把当前的组件类型添加到样式中进行标记
    var _class = 'component_'+conf.type;
	    _class += ' component_name_'+name;
    this.component = $('<div class="component '+_class+'" id="'+this.id+'"></div>');
	this.component.html(conf.text);
	if(conf.center === true){
		conf.css.marginLeft = 'calc(-'+conf.width+'/2)'; 
		conf.css.left = '50%';
	}
	if(conf.middle === true){
		conf.css.marginTop = 'calc(-'+conf.height+'/2)'; 
		conf.css.top = '50%';
	}
	if(conf.width !== ''){
		conf.css.width =  conf.width;
	}
	if(conf.height !== ''){
		conf.css.height =  conf.height;
	}
	if(conf.bg !== ''){
		conf.css.backgroundImage =  conf.bg;
	}
	//离场样式
	this.cssOut = conf.animateOut;
	//进场样式
	this.cssIn = conf.animateIn;
	//设置组件样式
	this.component.css($.extend(conf.css, conf.animateOut));
	var _this = this;
	//组件进场
	this.component.on('onLoad',function(){
		setTimeout(function(){
			_this.component.addClass('load').removeClass('leave');
			_this.cssIn && _this.component.css(_this.cssIn); //jq的animate方法不支持transform样式属性,所以这里用css
			//钩子
			if(typeof _this.onLoad === 'function'){
				_this.onLoad();
			}
		}, conf.delay || 0);
		return false;
	});
	//组件离场
	this.component.on('onLeave',function(){
		setTimeout(function(){
			_this.component.addClass('leave').removeClass('load');
			_this.cssOut && _this.component.css(_this.cssOut);
			//钩子
			if(typeof _this.onLoad === 'function'){
				_this.onLeave();
			}
		}, 0);//离场不要延时,否则看不到离场动画
		return false;//因为他的父级也有同名事件,所以需要阻止事件传播,避免onLoad事件死循环
	});
    this._setInstance(name);
	return this;
};

ComponentBase.prototype = {
	_instances:[],
	_setInstance:function(name){
		this._instances[name] = this;
	},
	_getInstance:function(name){
		return typeof this._instances[name] == 'undefined' ? false : this._instances[name];
	},
	show:function(){
		this.component.trigger('onLoad');
	},
	hide:function(){
		this.component.trigger('onLeave');
	}
}
window.ComponentBase = ComponentBase;

})(jQuery,window);