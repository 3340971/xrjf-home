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
	},
	//公共方法
	getDistance:function (p1, p2) {
		var x = p1.pageX - p2.pageX;
		var y = p1.pageY - p2.pageY;
		return Math.sqrt(x*x + y*y);
	},
	getAngle:function (p1, p2){
		var x = p1.pageX - p2.pageX;
		var y = p1.pageY - p2.pageY;
		return Math.atan2(y, x)*180/Math.PI;
	},
	//手势操作
	gesture:function (el,callBack){
		var isGesture = false;//是否在进行手势操作(两个手指操作)
		var start = {};
		var _this = this;
		el.addEventListener(
			"touchstart",
			function(e) {
				if(e.touches.length >= 2){
					isGesture = true;
					start.dis = _this.getDistance(e.touches[0], e.touches[1]); //双指的起始距离
					start.deg = _this.getAngle(e.touches[0], e.touches[1]);//双指与x轴正向的起始角度
					if(callBack && callBack.start){
						callBack.start.call(el, e);//让回调函数里的this指向元素
					}
				}
			}
		);
		el.addEventListener(
			"touchmove",
			function(e){
				if(e.touches.length >= 2 && isGesture){
					var dis = _this.getDistance(e.touches[0], e.touches[1]); 
					var deg =  _this.getAngle(e.touches[0], e.touches[1]);
					e.scale = dis/start.dis; //当前缩放比
					e.rotation = deg - start.deg; //当前旋转的角度
					if(callBack && callBack.change){
						callBack.change.call(el, e);
					}
				}
			}
		);
		el.addEventListener(
			"touchend",
			function(e){
				//多指操作的时候有一只离开,这时isGesture还是true,执行行end回调然后设置isGesture为false结束手势操作
				if(isGesture){
					if(callBack && callBack.end){
						callBack.end.call(el,e);
					}
				}
				isGesture = false;//
			}
		);
	},
	touch:function(obj, callbacks) {
	    var TOUCHSTART, TOUCHEND, TOUCHMOVE;    
	    if (typeof(window.ontouchstart) != 'undefined') {    
	        TOUCHSTART = 'touchstart';    
	        TOUCHEND = 'touchend';    
	        TOUCHMOVE ='touchmove';    
	     
	    } else if (typeof(window.onmspointerdown) != 'undefined') {    
	        TOUCHSTART = 'MSPointerDown';    
	        TOUCHEND = 'MSPointerUp';    
	        TOUCHMOVE ='MSPointerMove';    
	    } else {    
	        TOUCHSTART = 'mousedown';    
	        TOUCHEND = 'mouseup';    
	        TOUCHMOVE = 'mousemove';    
	    }
	    function getPos(event){
	        return {
	            x: event.changedTouches[0] ? event.changedTouches[0].pageX : event.pageX,
	            y: event.changedTouches[0] ? event.changedTouches[0].pageY : event.pageY
	        };
	    }
	    function isGusture(event){
	    	//这里不能用 changedTouches 的值
	        return (event.touches && event.touches.length > 1) ? true : false;
	    }
	    //s是开始, e是结束, l是上次move更新
	    var info = {sx:false, sy:false, lx:false, ly:false, ex:false, ey:false, sTime:false, lTime:false, eTime:false};
	    var date = new Date();
	    var touching = false;

	    obj.addEventListener(TOUCHSTART, function(event){
	        if(isGusture(event)){
	        	touching = false; //当第二根手指触发时,立刻停止拖拽,避免与其可能绑定的其它手势事件冲突
	        	return false;
	        }
	        touching = true;
	        //必须要复位,避免下次操作时累加
	        info.sTime = date.getTime();
	        info.lTime = false;
	        info.eTime = false;
	        var nowPos = getPos(event);
	        info.sx = nowPos.x;//开始坐标
	        info.sy = nowPos.y;
	        callbacks && callbacks.start && callbacks.start.call(obj, event, info);
	    }, false);
	  
	    obj.addEventListener(TOUCHMOVE, function(event) {
	        //确保是单指操作
	        if(!touching) return false;
	        event.preventDefault();//阻止触摸时浏览器的缩放、滚动条滚动
	        info.lTime = date.getTime();
	        var nowPos = getPos(event);
	        info.lx = nowPos.x;//不断改变坐标
	        info.ly = nowPos.y;
	        callbacks && callbacks.move && callbacks.move.call(obj, event, info);
	    }, false);
	  
	    obj.addEventListener(TOUCHEND, function(event) {
	        if(!touching) return false;
	        touching = false;
	        info.eTime = date.getTime();
	        var nowPos = getPos(event);
	        info.ex = nowPos.x;
	        info.ey = nowPos.y;
	        var changeX = info.ex - info.sx;//坐标变化值
	        var changeY = info.ey - info.sy;
	        //如果是水平滑动
	        if(Math.abs(changeX) > Math.abs(changeY) && Math.abs(changeY) > 5) {
	            //左滑动
	            if(changeX > 0) {
	                callbacks && callbacks.left && callbacks.left.call(obj, event, info);
	            }
	            //右滑动
	            else{
	                callbacks && callbacks.right && callbacks.right.call(obj, event, info);
	            }
	        }
	        //如果是垂直滑动
	        else if(Math.abs(changeY) > Math.abs(changeX) && Math.abs(changeX) > 5){
	            //上滑动
	            if(changeY > 0) {
	                callbacks && callbacks.up && callbacks.up.call(obj, event, info);
	            }
	            //下滑动
	            else{
	                callbacks && callbacks.down && callbacks.down.call(obj, event, info);
	            }
	        }
	        //滑动范围在5x5内则视为点击事件
	        else if(Math.abs(changeX) < 5 && Math.abs(changeY) < 5){
	            info.eTime = date.getTime();
	            //点击事件，此处根据时间差细分下
	            if((info.eTime - info.sTime) > 300) {
	                callbacks && callbacks.longTap && callbacks.longTap.call(obj, event, info); //长按
	            }
	            //时间很短,视为单击事件
	            else {
	                callbacks && callbacks.tap && callbacks.tap.call(obj, event, info); //当点击处理
	            }
	        }
	        
	        callbacks && callbacks.end && callbacks.end.call(obj, event, info);//touchend,gestureend事件
	    }, false);
	},
	//拖拽元素
	drag:function(obj){
	    var x, y, scale, _this = this;
	    this.touch(obj, {
	        start:function(e, pos){
	            x = _this.cssTransform(obj, 'translateX');
	            y = _this.cssTransform(obj, 'translateY');
	            scale = _this.cssTransform(obj, 'scale');
	        },
	        move:function(e, pos){
	            _this.cssTransform(obj, 'translateX', x + (pos.lx - pos.sx)/scale);
	            _this.cssTransform(obj, 'translateY', y + (pos.ly - pos.sy)/scale);
	        }
	    });
	},
	cssTransform:function (el,attr,val) {
		//因为直接通过style获取transform样式的时候,得到的值是一个matrix()或matrix3d()矩阵函数式,所以要想用js操作transform样式,必须手动记录元素的transform值
		//给元素添加自定义属性 transform,用来存储元素css3的transform属性值.
		if(!el.transform){
			el.transform = {};
		}
		if(typeof attr == 'string' && arguments.length == 2) {
			val  = el.transform[attr];
			if(typeof val == "undefined" ) {
				//scale变换的默认值是1,其它变换的默认值是0
				if(attr == "scale" || attr == "scaleX" || attr == "scaleY"  ) {
					val = 1;
				} else {
					val = 0;
				}
			}
			return val;
		} else {
			if(typeof attr == 'object'){
				attrs = attr;
			}else{
				attrs = {};
				attrs[attr] = val;
			}
			for(var i in attrs){
				el.transform[i] = attrs[i];
			}
			var sVal = "";
			for(var s in el.transform){
				switch(s) {
					case "rotate":
					case "skewX":
					case "skewY":
						sVal +=s+"("+el.transform[s]+"deg) "; //留空格,多个变换之间是用空格连接的
						break;
					case "translateX":
					case "translateY":
					case "translateZ":
						sVal +=s+"("+el.transform[s]+"px) ";
						break;
					case "scaleX":
					case "scaleY":
					case "scale":
						sVal +=s+"("+el.transform[s]+") ";
						break;	
				}
				el.style.WebkitTransform = el.style.transform = sVal;
			}
		}
	},
	//自定义可拖拽区域
	dragArea:function (wrap, callBack, direction) {
		var moveX = direction.indexOf('x') != '-1' ? true : false;
		var moveY = direction.indexOf('y') != '-1' ? true : false;
		var child = wrap.children[0]; 
		var startPoint = 0; //滑动开始的touch位置
		var startX = 0;//滑动开始时child的位置
		var startY = 0;//滑动开始时child的位置
		var minX = 0;
		var minY = 0;//负值,最小Y位移,即child拉动到底部时的scrollTop
		var stepX = 1;
		var stepY = 1;//当拖拽到两极发生超出的时候,child在可视区上占据的比例,其它时候这个值为1
		var lastX = 0; 
		var lastY = 0; 
		var lastTime = 0;
		var lastDisX = 0;
		var lastDisY = 0;
		var lastTimeDis = 1;
		var isMove = true;
		var Tween = {
			easeOut: function(t, b, c, d){
				//return -c * ((t=t/d-1)*t*t*t - 1) + b;
				return c*((t=t/d-1)*t*t*t*t + 1) + b;
			},
			backOut: function(t, b, c, d, s){
				if (typeof s == 'undefined') {
					s = 1.70158;  
				}
				return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
			} 
		};
		this.cssTransform(child,"translateZ",0.01);//开启3d硬件加速
		var _this = this;
		(function(){
			if(callBack && callBack.init){
				callBack.init(wrap, child);
			}
		})();
		wrap.addEventListener(
			'touchstart', 
			function(e) {
				e.preventDefault();
				e.stopPropagation();
				//正数:child没有撑满wrap,负数:child撑满了wrap并被隐藏了部分
				minX = wrap.clientWidth - child.offsetWidth;
				minY = wrap.clientHeight - child.offsetHeight;
				clearInterval(child.scroll);
				if(callBack && callBack.onStart){
					callBack.onStart();
				}
				startPoint = {pageY:e.changedTouches[0].pageY, pageX:e.changedTouches[0].pageX};
				startX = _this.cssTransform(child,"translateX");
				startY = _this.cssTransform(child,"translateY");
				stepX = 1;
				stepY = 1;
				lastX = startPoint.pageX;
				lastY = startPoint.pageY;
				lastTime = new Date().getTime();
				lastDisX = 0;
				lastDisY = 0;
				lastTimeDis = 1;
				isMove = true;
			}
		);
		wrap.addEventListener(
			'touchmove', 
			function(e) {
				e.preventDefault();
				e.stopPropagation();
				if(!isMove) {
					return ;
				}
				var nowPoint = e.changedTouches[0];
				var disX = nowPoint.pageX - startPoint.pageX;
				var disY = nowPoint.pageY - startPoint.pageY;
				var targetX = startX + disX;//运动后的位置
				var targetY = startY + disY;//运动后的位置
				var nowTime = new Date().getTime();
				if(targetX > 0) {
					stepX = 1 - targetX / wrap.clientWidth; 
					targetX = parseInt(targetX*stepX);
				}
				//targetY > 0 表示已经是在顶部了
				if(targetY > 0) {
					stepY = 1 - targetY / wrap.clientHeight; //1减去child在wrap视口中所占的比例,得到顶部拖拽产生的空白比例
					targetY = parseInt(targetY*stepY);//乘以比例系数进行回弹
				}
				if( (minX > 0) && (targetX < 0) ){
					targetX = 0;
					lastX = nowPoint.pageX;
				}
				//如果child高度比wrap小,并且是向 ↑ 拖拽,则拖拽不起作用
				if( (minY > 0) && (targetY < 0) ){
					targetY = 0;
					lastY = nowPoint.pageY;
				}
				if( (minX < 0) && (targetX < minX) ) {
					var over = minX - targetX; 
					stepX = 1-over / wrap.clientWidth;
					over = parseInt(over*stepX);
					targetX = minX - over;
				}
				//如果child高度超出wrap,并且向 ↑ 拖拽已经到底部了
				if( (minY < 0) && (targetY < minY) ){
					var over = minY - targetY; //拉动到底部并且产生的空白
					stepY = 1-over / wrap.clientHeight;//减去产生的空白的比例,即child在wrap视口上占据的比例
					over = parseInt(over*stepY);//超出多了的时候,继续拖拽,超出的部分应该逐渐减小,这里取child在wrap视口占比作为缩小因子
					targetY = minY - over;//over乘以比例因子后值变小了,child会慢慢开始回弹
				}
				
				lastDisX = nowPoint.pageX - lastX; 
				lastDisY = nowPoint.pageY - lastY; 
				lastTimeDis = nowTime - lastTime; 
				lastX = nowPoint.pageX;
				lastY = nowPoint.pageY;
				lastTime = nowTime;
				moveX && _this.cssTransform(child,"translateX",targetX);
				moveY && _this.cssTransform(child,"translateY",targetY);
				if(callBack && callBack.onUpdate){
					callBack.onUpdate();
				}
			}
		);
		wrap.addEventListener(
			'touchend', 
			function (e){
				e.preventDefault();
				e.stopPropagation();
				var speedX = (lastDisX/lastTimeDis)*200; //手指滑动的距离除以滑动的时间,得到手指离开时的运动速度,速度越大刹车距离越长
				var speedY = (lastDisY/lastTimeDis)*200; 
				speedX = isNaN(speedX)?0:speedX;//在刹车滑动的时候把手指按上去会停止滑动,这时速度会为0
				speedY = isNaN(speedY)?0:speedY;
				var targetX = _this.cssTransform(child,"translateX") + speedX;
				var targetY = _this.cssTransform(child,"translateY") + speedY;//speedY在这里就像是预留出刹车距离,实现动画结束的缓冲效果
				var typeX = typeY = "easeOut";
				var time = Math.abs(Math.max(speedX,speedY)*.9);
				time = time < 600 ? 600 : time;
				if(targetX > 0) {
					targetX = 0;
					typeX ="backOut";
				}
				if(targetY > 0) {
					targetY = 0;
					typeY ="backOut";
				}
				if( (minX < 0) && (targetX < minX) ) {
					targetX = minX;
					typeX ="backOut";
				}
				//如果child高度超出wrap,并且拖拽已经到底了
				if( (minY < 0) && (targetY < minY) ){
					targetY = minY;
					typeY ="backOut";
				}
				move(targetX, targetY, typeX, typeY, time);
				if(callBack&&callBack.onStop){
					callBack.onStop();
				}
			}
		);
		/*
			onStart 手指按下
			onUpdate 滑动中
			onStop 手指抬起
			onComplete 滑动结束
		*/
		function move(targetX, targetY, typeX, typeY, time) {
			//这里设置 t 从0到60,每16.666毫秒执行一次,即1秒钟60帧,这样帧率画面不会闪也好控制
			var t = 0;
			var bX = _this.cssTransform(child,"translateX");
			var bY = _this.cssTransform(child,"translateY");
			var cX = targetX - bX;
			var cY = targetY - bY;
			var d = 60;//Math.ceil(time/10);
			clearInterval(child.scroll);
			child.scroll = setInterval(
				function() {
					t++;
					if(t > d) {
						clearInterval(child.scroll);
						if(callBack&&callBack.onComplete){
							callBack.onComplete();
						}
					} else {
						var valueX = Tween[typeX](t,bX,cX,d);
						var valueY = Tween[typeY](t,bY,cY,d);
						moveX && _this.cssTransform(child,"translateX",valueX);
						moveY && _this.cssTransform(child,"translateY",valueY);
						if(callBack&&callBack.onUpdate){
							callBack.onUpdate();
						}
					}
				},16.66666
			);
		}
	}
}
window.ComponentBase = ComponentBase;

})(jQuery,window);