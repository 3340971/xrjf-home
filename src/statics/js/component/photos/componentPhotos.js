//张伟
(function($,window){
	var componentPhotos = function(name, conf){
		if(!(this instanceof componentPhotos)){
            return new componentPhotos(name, conf);
        }
        this.type = 'photos';
        var instance = this._getInstance(name);
	    if(instance){
	        return instance;
	    }
        this.conf = conf || {
        	imgs:[],
        	title:'相册',
        	cols:3,//3列
        	allowUpload:false,//是否允许上传
        	parentNode : document.body //挂载点
        };
        if(!this.conf.parentNode) this.conf.parentNode = document.body;

        ComponentBase.call(this, name, this.conf);
		var tpl =   '<header class="photos_title"></header>\
					<span class="upload-btn">上传</span>\
					<span class="close-component">关闭</span>\
					<div>\
						<ul>\
						</ul>\
						<footer>上划加载更多内容</footer>\
					</div>\
					<section class="img-detail">\
						<div class="detail-wrap"><canvas></canvas></div>\
						<header>大图<span class="close-detail">关闭</span></header>\
					</section>';
		this.component[0].innerHTML = tpl;//.append(tpl);
		//这里组件还没有进场,无法使用getBoundingClientRect,直接用它的挂载点对象
		//this.rect = this.component[0].getBoundingClientRect();
		this.rect = this.conf.parentNode.getBoundingClientRect();
		this.closeComponent = this.component[0].querySelector('.close-component');
		this.uploadBtn = this.component[0].querySelector('.upload-btn');
		this.scrollEl = this.component[0].children[3];
		this.titleEl = this.component[0].querySelector('.photos_title');
		this.ulEl = this.scrollEl.getElementsByTagName('ul')[0];
		this.lisEl = this.component[0].getElementsByTagName('li');
		this.footerEl = this.component[0].querySelector('footer');
		this.detailEl = this.component[0].querySelector('.img-detail');
		this.closeDetail = this.detailEl.querySelector('.close-detail');
		this.canvasEl = this.detailEl.querySelector('canvas');
		this.canvasCtx = this.canvasEl.getContext('2d');

		this.titleEl.innerText = this.conf.title;
		//this.cssTransform(this.detailEl, {translateZ: 0.01, scale: 0});//让弹出层的值和拖拽区一致,否则z-index失效
		this.detailEl.style.transition = this.detailEl.style.WebkitTransition = ".3s transform, .3s -webkit-transform";/*只让transform过渡,避免轴心transform-origin也参与过渡*/
		//隐藏footer
		this.cssTransform(this.footerEl, 'scale', 0);
		var _this = this;
		this.scrollCallback = {
			onBottom:function(value){
				var scale = - value/_this.footerEl.offsetHeight;
				if(scale > 1) scale = 1;
				//_this.cssTransform(_this.footerEl, 'scale', scale);
				if(_this.conf.imgs.length > 0){
					this.isBottom = false;
					_this.footerEl.innerText = '加载中...';
					//clearInterval(this.timer);
					_this.createLi(22);
					_this.createImg();
				}else{
					_this.footerEl.innerText = '啊哦!已经没有更多内容了.';
				}
			},
			onUpdate:function(value){
				if(value < 0){
					var scale = - value/_this.footerEl.offsetHeight;
					if(scale > 1) scale = 1;
					//_this.cssTransform(_this.footerEl, 'scale', scale);
				}
			},
			onComplete:function(){
				_this.footerEl.innerText = '';
				_this.cssTransform(_this.footerEl, 'scale', 0);
			}
		};
		this.liW = 0;
        this.liH = 0;
		_this._init();
		//文件上传
		this.cUpload = null;
		!this.conf.allowUpload && (this.uploadBtn.style.display = 'none');
		this.conf.allowUpload && this.loadStatics([
							this.conf.componentsUri + 'upload/componentUpload.js'
						], 
						function(loadedNum, rate){
							if(rate < 100) return;
							_this.cUpload = new componentUpload('upload_'+name, {
																width:this.liW + 'px',
																height:this.liH + 'px',
																parentNode   : _this.ulEl,
																componentNodeType  : 'li',
																className    : '',
																componentsUri : _this.conf.componentsUri,
																submitEl 	 : _this.uploadBtn,//触发点击上传的提交按钮
													        	successCallback : _this.conf.successCallback ||  function(){},//每上传成功一个的回调函数
													        	deleteCallback : _this.conf.deleteCallback ||  function(){},//每删除一个的回调函数
													        	httpHeader   : _this.conf.httpHeader || {},//附加的http头
													        	formData     : _this.conf.formData || {},
													        	server: _this.conf.server,
													        	//设定单个文件大小
													            fileSingleSizeLimit: _this.conf.fileSingleSizeLimit ||  4 * 1024 * 1024,
													            fileSizeLimit: _this.conf.fileSizeLimit || 50 * 1024 * 1024,//[默认值：undefined] 验证文件总大小是否超出限制, 超出则不允许加入队列
													            // 上传文件个数
													            fileNumLimit : _this.conf.fileNumLimit || 20,
													        	onComponentReady:function(obj){
													        		
													        	}
															})
															.show();
						},1);
		return this;
	}
	componentPhotos.prototype = $.extend({}, ComponentBase.prototype, {
		_init:function(){
			var _this = this;
			this.conf.parentNode.appendChild(this.component[0]);
			//设置相册缩略图的高度
			//var liH = this.lisEl[0].getBoundingClientRect().width;
			var colW = this.conf.parentNode.getBoundingClientRect().width/this.conf.cols;//列宽
			this.liW = colW*0.92;
        	this.liH = colW*0.92;
			//创建一个相册专属的style标签
			var style = document.createElement('style');
			style.setAttribute('id', 'componentPhotos');
			style.innerText = ".component_photos li{width:"+this.liW+"px;height:"+this.liH+"px;margin:"+(colW*0.04)+"px;}";
			document.querySelector('head').appendChild(style);
			
			this.createLi(this.conf.imgs.length > 15 ? 200 : this.conf.imgs.length);
			//显示删除按钮
			this.conf.allowUpload && this.touch(this.ulEl, {longTap:function(e){
				if(e.target.nodeName.toLowerCase() == 'canvas'){
					var li  = e.target.parentNode,
						del = li.querySelector('.delete');
					del.classList.add('active');
				}
			}});

			//查看缩略图
			this.touch(this.ulEl, {tap:function(e){
				if(e.target.nodeName.toLowerCase() == 'canvas'){
					var li = e.target.parentNode;
					//改变缩放的轴心,样式编写的时候注意只让transform属性过渡,避免轴心transform-origin属性也参与过渡
					var rect = li.getBoundingClientRect();
					var x = rect.left + rect.width/2,
						y = rect.top + rect.height/2;
					_this.detailEl.style.transformOrigin = _this.detailEl.style.WebkitTransformOrigin = x+'px '+y+'px';
					_this.cssTransform(_this.detailEl, 'scale', 1);
					var img = new Image();
					img.src = li.getAttribute('src-max') || li.getAttribute('src');
					img.onload = function(){
						_this.canvasEl.width = img.width;
						_this.canvasEl.height = img.height;
						_this.canvasCtx.drawImage(img, 0, 0, img.width, img.height);
						_this.cssTransform(_this.canvasEl, 'scale', 1);
						_this.cssTransform(_this.canvasEl, 'translateX', 0);
						_this.cssTransform(_this.canvasEl, 'translateY', 0);
					};
				}
			}});
			
			//点击删除按钮
			this.conf.allowUpload && this.touch(this.ulEl, {tap:function(e){
				if(e.target.classList.contains('delete')){
					var del = e.target,
						li  = e.target.parentNode;
						id  = li.getAttribute('img-id');
					if(id && li.classList.contains('component-photos-item')){
						li.parentNode.removeChild(li);
						_this.conf.deleteCallback(li);
					}
				}
			}});


			this.scrollBox(this.scrollEl, this.scrollCallback);//相册列表的拖拽

			//关闭事件
			this.closeDetail.addEventListener('touchend', function(){
				this.cssTransform(this.detailEl, 'scale', 0);
			}.bind(this), false);
			this.closeComponent.addEventListener('touchend', function(){
				_this.component.trigger('onLeave');
			}, false);
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
		createLi:function (len){
			var _this = this;
				//fragment = document.createDocumentFragment();
			for (var i = 0; i < len; i++) {
				if(this.conf.imgs.length < 1) break;
				var li  = document.createElement('li');
				var img = this.conf.imgs.shift();
				li.setAttribute('src-min', img.min);
				li.setAttribute('src-max', img.max);
				li.setAttribute('img-id', img.id);
				li.classList.add('component-photos-item');
				li.isLoad = false;
				var del = document.createElement('span');
				del.setAttribute('class', 'delete');
				del.setAttribute('img-id', img.id);
				del.innerText = '×';
				li.appendChild(del);
				this.ulEl.appendChild(li);
			}
			//this.ulEl.appendChild(fragment);
			this.createImg();
		},
		createImg:function (){
			for (var i = 0; i < this.lisEl.length; i++) {
				//判断是否显示图片(是否在可视区内),因为有进场动画,所以这里getBoundingClientRect无法获取正确值
				//var top = this.lisEl[i].getBoundingClientRect().top;
				if(!this.lisEl[i].isLoad ){
					this.showImg(this.lisEl[i]);
				}
			}
		},
		showImg:function (li){
			li.isLoad = true;
			var img = new Image();
			img.src = li.getAttribute('src-min');
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