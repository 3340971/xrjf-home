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
		componentNodeType : 'div',
		componentsUri : '/statics/components/',
		type: this.type || 'base',
		text:'',
		bg:'',
		width:'',
		height:'',
		center: false,//水平居中
		middle: false,//垂直居中
		css:{},
		animateIn:{opacity:'1'},//载入时的样式
		animateOut:{opacity:'0'},//移出时的样式
		delay:0 //延迟时间
	};
	this.conf = $.extend({}, options, conf);
	//给每个组件分配一个ID
    this.id = ('c_' + Math.random()).replace('.','_');
    // 把当前的组件类型添加到样式中进行标记
    var _class = 'component_'+this.conf.type;
	    _class += ' component_name_'+name;
	this.component = document.createElement(this.conf.componentNodeType);
	this.component.setAttribute('class', 'component '+_class);
	this.component.setAttribute('id', this.id);
	this.component.insertAdjacentHTML('beforeEnd', this.conf.text);
	this.component = $(this.component);
	if(this.conf.center === true){
		this.conf.css.marginLeft = 'calc(-'+this.conf.width+'/2)'; 
		this.conf.css.left = '50%';
	}
	if(this.conf.middle === true){
		this.conf.css.marginTop = 'calc(-'+this.conf.height+'/2)'; 
		this.conf.css.top = '50%';
	}
	if(this.conf.width !== ''){
		this.conf.css.width =  this.conf.width;
	}
	if(this.conf.height !== ''){
		this.conf.css.height =  this.conf.height;
	}
	if(this.conf.bg !== ''){
		this.conf.css.backgroundImage =  this.conf.bg;
	}
	//离场样式
	this.cssOut = this.conf.animateOut;
	//进场样式
	this.cssIn = this.conf.animateIn;
	//设置组件样式
	this.component.css($.extend(this.conf.css, this.conf.animateOut));
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
		}, _this.conf.delay || 0);
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
		this._instances[this.type + '_' + name] = this;
	},
	_getInstance:function(name){
		return typeof this._instances[this.type + '_' + name] == 'undefined' ? false : this._instances[this.type + '_' + name];
	},
	//组件准备好后的回调函数
	onComponentReady:function(obj){
		if(typeof this.conf.onComponentReady == 'function')
			this.conf.onComponentReady(obj);
	},
	show:function(){
		this.component.trigger('onLoad');
	},
	hide:function(){
		this.component.trigger('onLeave');
	},
	//公共方法
	loadStatics:function(files, callback, version){
	    var ext   = '?v=' + (version || 1),
	        loads = [],
	        type;
	    for(var i in files){
	        if(files[i].indexOf('.css') > 0){
	            type = 'css';
	        }else if(files[i].indexOf('.js') > 0){
	            type = 'js';
	        }else{
	            continue;
	        }
	        loads.push({src:files[i] + ext, type:type});
	    }
	    var total     = loads.length,//待加载的文件总数
	        loadedNum = 0,//已加载的文件数
	        rate      = 0,//加载进度
	        head      = document.getElementsByTagName('head')[0];
	    
	    var loadFiles = function(files){
	        if(files.length == 0){
	            return false;
	        }
	        var file = files.shift();
	        var el;
	        if(file.type == 'js'){
	            el = document.createElement('script');
	            el.type = 'text/javascript';
	            el.src = file.src;
	        }else{
	            el = document.createElement('link');
	            el.type = 'text/css';
	            el.rel = 'stylesheet';
	            el.href = file.src;
	        }
	        el.onload = el.onreadystatechange = function(){
	            if((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")){
	                loadedNum++;
	                rate = parseInt(loadedNum/total*100);
	                callback(loadedNum, rate);
	                //console.log('加载完毕:', this.src || this.href);
	                //加载下一个文件,这里实现了文件一个个顺序加载,上一个加载完成才会head.appendChild下一个元素
	                loadFiles(files);
	                el.onload = el.onreadystatechange = null;//清除事件
	            }
	        }
	        head.appendChild( el );
	    }
	    loadFiles(loads);
	},
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
			},
		false);
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
			},
		false);
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
			},
		false);
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
	    var touching = false;

	    obj.addEventListener(TOUCHSTART, function(event){
	        if(isGusture(event)){
	        	touching = false; //当第二根手指触发时,立刻停止拖拽,避免与其可能绑定的其它手势事件冲突
	        	return false;
	        }
	        touching = true;
	        //必须要复位,避免下次操作时累加
	        info.sTime = new Date().getTime();
	        info.lTime = false;
	        info.eTime = false;
	        var nowPos = getPos(event);
	        info.sx = nowPos.x;//开始坐标
	        info.sy = nowPos.y;
	        //300毫秒后滑动范围在5x5内(没有移动)视为长按操作
	        setTimeout(function(){
	        	if(!touching) return false;//确保还没有发生end事件
		        if( (!info.lx || Math.abs(info.lx - info.sx) < 5) 
		        	&& 
		        	(!info.ly || Math.abs(info.ly - info.sy) < 5))
		        {
		        	touching = false;
		        	callbacks && callbacks.longTap && callbacks.longTap.call(obj, event, info); //长按
		        }
	        }, 300);
	        callbacks && callbacks.start && callbacks.start.call(obj, event, info);
	    }, false);
	  
	    obj.addEventListener(TOUCHMOVE, function(event) {
	        //确保是单指操作
	        if(!touching) return false;
	        event.preventDefault();//阻止触摸时浏览器的缩放、滚动条滚动
	        info.lTime = new Date().getTime();
	        var nowPos = getPos(event);
	        info.lx = nowPos.x;//不断改变坐标
	        info.ly = nowPos.y;
	        callbacks && callbacks.move && callbacks.move.call(obj, event, info);
	    }, false);
	  
	    obj.addEventListener(TOUCHEND, function(event) {
	        if(!touching) return false;
	        touching = false;
	        info.eTime = new Date().getTime();
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
	dragArea:function (wrap, callBack, direction, dragEl) {
		var moveX = direction.indexOf('x') != '-1' ? true : false;
		var moveY = direction.indexOf('y') != '-1' ? true : false;
		var child = dragEl || wrap.children[0];
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
				return -c * ((t=t/d-1)*t*t*t - 1) + b;
			},
			backOut: function(t, b, c, d, s){
				if (typeof s == 'undefined') {
					s = 1.70158;  
				}
				return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
			} 
		};
		child.style.position = 'absolute';
		//this.cssTransform(child,"translateZ",0.01);//开启3d硬件加速
		var _this = this;
		(function(){
			if(callBack && callBack.init){
				callBack.init(wrap, child);
			}
		})();
		wrap.addEventListener(
			'touchstart', 
			function(e) {
				//e.preventDefault();
				//e.stopPropagation();
				//正数:child没有撑满wrap,负数:child撑满了wrap并被隐藏了部分
				minX = wrap.clientWidth - child.offsetWidth;
				minY = wrap.clientHeight - child.offsetHeight;
				clearInterval(child.scroll);
				if(callBack && callBack.onStart){
					callBack.onStart();
				}
				startPoint = {pageY:e.changedTouches[0].pageY, pageX:e.changedTouches[0].pageX};
				startX = child.offsetLeft;//_this.cssTransform(child,"translateX");
				startY = child.offsetTop;//_this.cssTransform(child,"translateY");
				stepX = 1;
				stepY = 1;
				lastX = startPoint.pageX;
				lastY = startPoint.pageY;
				lastTime = new Date().getTime();
				lastDisX = 0;
				lastDisY = 0;
				lastTimeDis = 1;
				isMove = true;
			},
		false);
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
				if(moveX) child.style.left = targetX + 'px';//moveX && _this.cssTransform(child,"translateX",targetX);
				if(moveY) child.style.top  = targetY + 'px';//moveY && _this.cssTransform(child,"translateY",targetY);
				if(callBack && callBack.onUpdate){
					callBack.onUpdate();
				}
			},
		false);
		wrap.addEventListener(
			'touchend', 
			function (e){
				//e.preventDefault();
				//e.stopPropagation();
				if(!isMove) {
					return ;
				}
				isMove = false;
				var speedX = (lastDisX/lastTimeDis)*320; //手指滑动的距离除以滑动的时间,得到手指离开时的运动速度,速度越大刹车距离越长
				var speedY = (lastDisY/lastTimeDis)*320; 
				speedX = isNaN(speedX)?0:speedX;//在刹车滑动的时候把手指按上去会停止滑动,这时速度会为0
				speedY = isNaN(speedY)?0:speedY;
				var targetX = child.offsetLeft + speedX;//_this.cssTransform(child,"translateX") + speedX;
				var targetY = child.offsetTop + speedY;//_this.cssTransform(child,"translateY") + speedY;//speedY在这里就像是预留出刹车距离,实现动画结束的缓冲效果
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
			},
		false);
		/*
			onStart 手指按下
			onUpdate 滑动中
			onStop 手指抬起
			onComplete 滑动结束
		*/
		function move(targetX, targetY, typeX, typeY, time) {
			//假设要求动画每秒的帧率是30帧,并且变化值为200px的时候要求刹车时间是1秒
			//则设置 t 从0帧到30帧, 平均每帧运动 200/30=6.666px距离, 平均用时 1000ms/30帧=33.3333毫秒
			//如果变化值有350px, 那么帧数就应该是 0帧 到 30*(350/200)= 52.5帧
			var t = 0;
			var bX = child.offsetLeft;//_this.cssTransform(child,"translateX");
			var bY = child.offsetTop;//_this.cssTransform(child,"translateY");
			var cX = targetX - bX;
			var cY = targetY - bY;
			var d = Math.abs(60*(cY/300));//Math.ceil(time/10);
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
						if(moveX) child.style.left = valueX + 'px';//_this.cssTransform(child,"translateX",valueX);
						if(moveY) child.style.top  = valueY + 'px';//_this.cssTransform(child,"translateY",valueY);
						if(callBack&&callBack.onUpdate){
							callBack.onUpdate();
						}
					}
				},16.6666 //(1秒钟60帧)
			);
		}
	}
}
window.ComponentBase = ComponentBase;

})(jQuery,window);