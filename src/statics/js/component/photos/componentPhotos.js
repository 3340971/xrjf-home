//张伟
(function($,window){
	var componentPhotos = function(name, conf){
		if(!(this instanceof componentPhotos)){
            return new componentPhotos(name, conf);
        }
        var instance = this._getInstance(name);
	    if(instance){
	        return instance;
	    }
        this.type = 'photos';
        this.conf = conf || {
        	imgs:[],
        	cols:3,//3列
        	parentNode : document.body //挂载点
        };
        if(!this.conf.parentNode) this.conf.parentNode = document.body;

        ComponentBase.call(this, name, this.conf);
		var tpl =   '<div>\
						<ul>\
							<li>+</li>\
						</ul>\
						<footer>上划加载更多内容</footer>\
					</div>\
					<section class="img-detail">\
						<div class="detail-wrap"><canvas></canvas></div>\
						<header>大图<span class="close">关闭</span></header>\
					</section>';
		this.component.append(tpl);
		//这里组件还没有进场,无法使用getBoundingClientRect,直接用它的挂载点对象
		//this.rect = this.component[0].getBoundingClientRect();
		this.rect = this.conf.parentNode.getBoundingClientRect();
		this.dragEl = this.component[0].children[0];
		this.ulEl = this.dragEl.getElementsByTagName('ul')[0];
		this.lisEl = this.component[0].getElementsByTagName('li');
		this.footerEl = this.component[0].querySelector('footer');
		this.detailEl = this.component[0].querySelector('.img-detail');
		this.closeBtn = this.detailEl.querySelector('.close');
		this.canvasEl = this.detailEl.querySelector('canvas');
		this.canvasCtx = this.canvasEl.getContext('2d');
		this.cssTransform(this.detailEl, {translateZ: 0.01, scale: 0});//让弹出层的值和拖拽区一致,否则z-index失效
		this.detailEl.style.transition = this.detailEl.style.WebkitTransition = ".3s transform, .3s -webkit-transform";/*只让transform过渡,避免轴心transform-origin也参与过渡*/
		//隐藏footer
		this.cssTransform(this.footerEl, 'scale', 0);
		var _this = this;
		this.dragCallback = {
			onStart:function(){
				
			},
			onUpdate:function(){
				if(_this.component[0].clientHeight < _this.dragEl.offsetHeight){
					var scrollTop = _this.cssTransform(_this.dragEl, 'translateY');//当前已卷进去的数值,负的
					var maxScroll = _this.component[0].clientHeight - _this.dragEl.offsetHeight; //拉到底部时的值,负的
					if(scrollTop <= maxScroll){
						var over = maxScroll - scrollTop ;//拉动到底部并且超出的值
						var scale = over/_this.footerEl.offsetHeight;
						if(scale > 1) scale = 1;
						_this.footerEl.innerText = _this.conf.imgs.length > 0 ? '上划加载更多内容' : '已经没有更多内容了';
						_this.cssTransform(_this.footerEl, 'scale', scale);

						if(_this.conf.imgs.length > 0){
							clearInterval(_this.dragEl.scroll);
							_this.createLi(22);
						}
					}
				}
			},
			onStop:function(){

			},
			onComplete:function(){
				_this.createImg();
			}
		};
		this._init();
		return this;
	}
	componentPhotos.prototype = $.extend(ComponentBase.prototype, {
		_init:function(){
			var _this = this;
			this.conf.parentNode.appendChild(this.component[0]);
			//设置相册缩略图的高度
			//var liH = this.lisEl[0].getBoundingClientRect().width;
			var colW = this.conf.parentNode.getBoundingClientRect().width/this.conf.cols;//列宽
			//创建一个相册专属的style标签
			var style = document.createElement('style');
			style.setAttribute('id', 'componentPhotos');
			style.innerText = ".component_photos li{width:"+(colW*0.92)+"px;height:"+(colW*0.92)+"px;margin:"+(colW*0.04)+"px;}";
			document.querySelector('head').appendChild(style);
			
			this.createLi(this.conf.imgs.length > 15 ? 25 : this.conf.imgs.length);
			this.dragArea(this.component[0], this.dragCallback, 'y');//相册列表的拖拽

			//关闭事件
			this.closeBtn.addEventListener('touchend', function(){
				this.cssTransform(this.detailEl, 'scale', 0);
			}.bind(this), false);
			//手势操作
			var startScale = 0, startRotate = 0;
			this.gesture(this.canvasEl,{
				start:function(e) {
					e.preventDefault();
					e.stopPropagation();
					startScale = _this.cssTransform(this,"scale");
				},
				change:function(e) {
					e.preventDefault();
					e.stopPropagation();
					var disS = e.scale;
					_this.cssTransform(this,"scale",startScale*disS);
				},
				end:function(e) {
					e.preventDefault();
					e.stopPropagation();
				}
			});
			this.drag(this.canvasEl);
		},
		_calLiClientTop:function(i){
			return Math.floor((i+1)/this.conf.cols) * (this.lisEl[0].offsetHeight/0.92) + this.cssTransform(this.dragEl,'translateY');
		},
		createLi:function (len){
			var _this = this;
			for (var i = 0; i < len; i++) {
				if(this.conf.imgs.length < 1) break;
				var li = document.createElement('li');
				li.setAttribute('src', this.conf.imgs.shift());
				li.isLoad = false;
				this.touch(li, {tap:function(){
					//改变缩放的轴心,样式编写的时候注意只让transform属性过渡,避免轴心transform-origin属性也参与过渡
					var rect = this.getBoundingClientRect();
					var x = rect.left + rect.width/2,
						y = rect.top + rect.height/2;
					_this.detailEl.style.transformOrigin = _this.detailEl.style.WebkitTransformOrigin = x+'px '+y+'px';
					_this.cssTransform(_this.detailEl, 'scale', 1);
					var img = new Image();
					img.src = this.getAttribute('src');
					img.onload = function(){
						_this.canvasEl.width = img.width;
						_this.canvasEl.height = img.height;
						_this.canvasCtx.drawImage(img, 0, 0, img.width, img.height);
						_this.cssTransform(_this.canvasEl, 'scale', 1);
						_this.cssTransform(_this.canvasEl, 'translateX', 0);
						_this.cssTransform(_this.canvasEl, 'translateY', 0);
					}
				}});
				this.ulEl.appendChild(li);
			}
			this.createImg();
		},
		createImg:function (){
			for (var i = 1; i < this.lisEl.length; i++) {
				//判断是否显示图片(是否在可视区内),因为有进场动画,所以这里getBoundingClientRect无法获取正确值
				//var top = this.lisEl[i].getBoundingClientRect().top;
				var top = this._calLiClientTop(i);
				if(!this.lisEl[i].isLoad && top >= this.rect.top && top <= this.rect.bottom){
					this.showImg(this.lisEl[i]);
				}
			}
		},
		showImg:function (li){
			li.isLoad = true;
			var img = new Image();
			img.src = li.getAttribute('src');
			img.onload = function(){
				var c = document.createElement('canvas');
				var ctx = c.getContext('2d');
				//让画布大小等于图片实际大小
				c.width = img.width;
				c.height = img.height;
				ctx.drawImage(img, 0, 0, c.width, c.height);
				li.appendChild(c);
			}
			img.onerror = function(){
				li.isLoad = false;
			}
		}
	});
	window.componentPhotos = componentPhotos;
})(jQuery,window);