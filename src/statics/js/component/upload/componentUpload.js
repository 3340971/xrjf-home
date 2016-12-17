//张伟
(function($,window){
	var componentUpload = function(name, conf){
		
		if(!(this instanceof componentUpload)){
            return new componentUpload(name, conf);
        }
        this.type = 'upload';
        var instance = this._getInstance(name);
	    if(instance){
	        return instance;
	    }
        //配置允许上传的类型 图片/音视频/flash/文件
	    var accept = {
	       //图片
	       image: {
	         title : 'Images',//标题
	         extensions : 'gif,jpg,jpeg,bmp,png,ico',//允许上传文件的后缀
	         mimeTypes : 'image/*'//允许的mimetype
	       },
	       //音视频
	       video: {
	         title : 'Videos',
	         extensions : 'wmv,asf,asx,rm,rmvb,ram,avi,mpg,dat,mp4,mpeg,divx,m4v,mov,qt,flv,f4v,mp3,wav,aac,m4a,wma,ra,3gp,3g2,dv,vob,mkv,ts',
	         mimeTypes : 'video/*,audio/*'
	       },
	       //flash
	       flash: {
	         title : 'Flashs',
	         extensions : 'swf,fla',
	         mimeTypes : 'application/x-shockwave-flash'
	       },
	       //办公文档，压缩文件等等
	       file: {
	         title : 'Files',
	         extensions : 'zip,rar,ppt,pptx,doc,docx,xls,xlsx,pdf',
	         mimeTypes : 'application/zip,application/x-rar-compressed,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf'
	       }
	    };
        this.conf = $.extend({
        	className    : '',
        	parentNode   : document.body, //挂载点
        	submitEl 	 : null,//触发点击上传的提交按钮
        	successCallback : function(){},//每上传成功一个的回调函数
        	deleteCallback : function(){},//每删除一个的回调函数
        	httpHeader   : {},//附加的http头
        	//以下是插件配置
        	// 选完文件后，是否自动上传。
            auto: false,
            // swf文件路径。可选。
            //swf: 'webupload-0.1.5/Uploader.swf',
            // 文件接收服务端。
            server: 'fileupload.php',
            threads:3,//[默认值：3] 上传并发数,允许同时最大上传进程数
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            //pick: '#filePicker',
            pick : {
                id : '#filePicker',//指定选择文件的按钮容器，不指定则不创建按钮。注意 这里虽然写的是 id, 但是不是只支持 id, 还支持 class, 或者 dom 节点
                label : null, //'点击选择图片',
                innerHTML: '+',
                multiple: true //是否开起同时选择多个文件能力,默认true
            },
            
            //dnd : '#uploader .queueList',//指定拖拽的容器
            disableGlobalDnd :false,//是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
            
            paste : document.body,//指定监听paste事件的容器,通过粘贴来添加截屏的图片,建议设置为document.body
            // 开起分片上传。
            chunked: true,
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false,
            //设定单个文件大小
            fileSingleSizeLimit: 6 * 1024 * 1024,
            fileSizeLimit: 30 * 1024 * 1024,//[默认值：undefined] 验证文件总大小是否超出限制, 超出则不允许加入队列
            // 上传文件个数
            fileNumLimit : 8,
            //文件上传请求的参数表，每次发送都会发送此对象中的参数。
            formData: {

            },
            fileVal:'file[]',//[可选] [默认值：'file'] 设置文件上传域的name
            method:'POST',//[可选] [默认值：'POST'] 文件上传方式，POST或者GET
            sendAsBinary:false,//[可选] [默认值：false] 是否以二进制的流的方式发送文件，这样整个上传内容php://input都为文件内容， 其他参数在$_GET数组中
            //允许选择的文件。
            accept:accept.image,
            // 或
            // accept: {
            //     title: 'Images',
            //     extensions: 'gif,jpg,jpeg,bmp,png,doc,docx',
            //     mimeTypes: 'image/*,application/msword'
            // },
            //[可选] 配置生成缩略图的选项
            thumb:{
                width: 800,
                height: 800,
                // 图片质量，只有type为`image/jpeg`的时候才有效。
                quality: 100,
                // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                allowMagnify: true,
                // 是否允许裁剪。
                crop: true,
                // 为空的话则保留原有图片格式。
                // 否则强制转换成指定的类型。
                type: 'image/jpeg'
            }
        }, conf);
        ComponentBase.call(this, name, this.conf);
        var _this = this;
        this.conf.pick.id = this.component[0];

        this.uploader = null;
        //this.component[0].innerText = '+';
        this.component[0].className += ' ' + this.conf.className;
        this.liW = 0;
        this.liH = 0;
        //加载资源
		this.loadStatics([
							this.conf.componentsUri + 'upload/libs/webupload-0.1.5/webuploader.css',
							this.conf.componentsUri + 'upload/componentUpload.css',
							this.conf.componentsUri + 'upload/libs/webupload-0.1.5/webuploader.js'
						], 
						function(loadedNum, rate){
							if(rate < 100) return;
							if(_this.conf.parentNode.firstChild){
								_this.conf.parentNode.insertBefore(_this.component[0], _this.conf.parentNode.firstChild);
							}else{
								_this.conf.parentNode.appendChild(_this.component[0]);
							}
							//让li与组件同大小
							var rect  = window.getComputedStyle(_this.component[0], null);
							_this.liW = rect.width;
        					_this.liH = rect.height;
							_this.uploader = WebUploader.create(_this.conf);
							_this._init();
						});
		return this;
	};
	//不能写成 $.extend(ComponentBase.prototype, {}) 否则组件调用组件的时候 ComponentBase.prototype 会被污染
	componentUpload.prototype = $.extend({}, ComponentBase.prototype, {
		_init:function(){
			var _this = this;
			// 当有文件被添加进队列的时候
	        this.uploader.on( 'fileQueued', function( file ){
	            // 创建缩略图
	            // 如果为非图片文件，可以不用调用此方法。
	            // thumbnailWidth x thumbnailHeight 为 100 x 100
	            _this.uploader.makeThumb(file, function( error, src ) {
	                if ( error ) {
	                    _this._createLi(file.id, false);
	                }else{
	                	_this._createLi(file.id, src);
	                }
	            }, 100, 100 );
	        });
	        //点击上传
	        !this.conf.auto && this.conf.submitEl && this.conf.submitEl.addEventListener('touchend', function(e){
	        	if(_this.conf.parentNode.querySelectorAll('.un-upload').length < 1){
	        		alert('没有待上传的文件');
	        	}else{
	        		_this.uploader.upload();
	        	}
	        }, false);
	        // 文件上传过程中创建进度条实时显示。
	        this.uploader.on( 'uploadProgress', function( file, percentage ) {
	            var liEl = _this.conf.parentNode.querySelector( '#'+file.id),
	                percent = liEl.querySelector('.progress .progress-bar');
	            liEl.classList.remove('un-upload');
	            liEl.classList.add('in-upload');
	            liEl.querySelector('.state').innerText = '上传中';
	            percent.style.width = percentage * 100 + '%';
	        });
	        /***********文件成功、失败处理**********/
	        //成功则派送uploadSuccess事件。response 服务端的返回数据  
	        //需注意,因为插件不知道服务器返回什么才是上传成功,建议用uploadAccept回调区分成功、失败
	        this.uploader.on( 'uploadSuccess', function( file ,response ) {
	        	var liEl = _this.conf.parentNode.querySelector( '#'+file.id);
	        	liEl.classList.remove('in-upload');
	            liEl.classList.add('success-upload');
	            liEl.querySelector('.state').innerText = '已上传';
	            liEl.querySelector('input').value = response.data.src;
	            var stats = _this.uploader.getStats();
	            _this.conf.successCallback(liEl, response, stats.progressNum);//上传中的文件数
	        });
	        //文件上传失败会派送uploadError事件.
	        this.uploader.on( 'uploadError', function( file , reason ) {
	        	var liEl = _this.conf.parentNode.querySelector( '#'+file.id);
	        	liEl.classList.remove('in-upload');
	            liEl.classList.add('error-upload');
	        	liEl.querySelector('.state').innerText = reason != 'server' ? reason : '上传出错';
	        });
	        //不管成功或者失败，在文件上传完后都会触发uploadComplete事件。
	        this.uploader.on( 'uploadComplete', function( file ) {
	        	var liEl = _this.conf.parentNode.querySelector( '#'+file.id);
	        	liEl.classList.remove('in-upload');
	            liEl.classList.add('complete-upload');
	            //$( '#'+file.id,$list).find('.progress').fadeOut();
	        });
	        //当所有文件上传结束时触发
	        this.uploader.on( 'uploadFinished', function() {
	            _this.uploader.getStats();
	            /*
	            返回一个包含一下信息的对象。
	            successNum 上传成功的文件数
	            progressNum 上传中的文件数
	            cancelNum 被删除的文件数
	            invalidNum 无效的文件数
	            uploadFailNum 上传失败的文件数
	            queueNum 还在队列中的文件数
	            interruptNum 被暂停的文件数
	            */
	        });
	        //在uploadBeforeSend的回调中设置请求的头部、附加的数据
	        this.uploader.on('uploadBeforeSend', function(block, formData, headers) {
	            $.extend(headers, _this.conf.httpHeader);
	        });
	        //response 服务端的返回数据，json格式，如果服务端不是json格式，从ret._raw中取数据，自行解析。
	        //当某个文件上传到服务端响应后，会派送此事件来询问服务端响应是否有效。如果此事件handler返回值为`false`, 则此文件将派送`server`类型的`uploadError`事件
	        this.uploader.on( 'uploadAccept', function( block, response ,fn) {
	            if ( response.code ) {
	                //file = block.file;
	                //uploader.getStats(); 该方法不能在此处调用,因为该次成功失败并未出结果,所以还是上次的统计数据
	            }else{
	                //fn的作用是把传入的参数值赋值给 uploadError 的 reason 参数(没有这一步,reason永远是默认值'server')
	                fn(response.message);
	                // 通过return false来告诉组件，此文件上传有错,并触发 uploadError
	                return false;
	            }
	        });
	        this.uploader.on("error",function (type){
	            if (type=="Q_TYPE_DENIED"){
	                alert("文件格式错误");
	            }else if(type=="F_EXCEED_SIZE"){
	                alert("文件大小不能超过" + (_this.conf.fileSingleSizeLimit/1024/1024) + "M");
	            }else if(type=="F_DUPLICATE"){
	                alert("请勿选择重复文件");
	            }else if(type=="Q_EXCEED_NUM_LIMIT"){
	                alert("文件数量超出限制值:" + _this.conf.fileNumLimit);
	            }else{
	                alert(type);
	            }
	        });
	        this.onComponentReady(this);
		},
		_createLi:function (fileId, src){
			var _this = this;
			var li    = document.createElement('li'),
				style = 'width:'+this.liW+';height:'+this.liH+';';
			li.setAttribute('id', fileId);
			li.setAttribute('src', src);
			li.setAttribute('class', 'component-upload-li un-upload' + this.conf.className);
			li.style = style;
			if(src === false){
				li.innerHTML = '<span>不能预览</span>';
			}else{
				var img = new Image();
				img.src = src;
				img.onload = function(){
					var c = document.createElement('canvas');
					var ctx = c.getContext('2d');
					//让画布大小等于图片实际大小
					c.width  = parseFloat(_this.liW);
					c.height = parseFloat(_this.liH);
					ctx.drawImage(img, 0, 0, c.width, c.height);
					li.appendChild(c);
				}
				img.onerror = function(){
					
				}
			}
			li.insertAdjacentHTML('beforeEnd', 
	            				'<input type="hidden" name="'+ this.conf.fileVal +'" value="" />\
	            				<span class="delete">×</span>\
	            				<div class="progress progress-striped active">\
	                                <div class="progress-bar" role="progressbar" style="width: 0%"></div>\
	                                <span class="state">等待上传</span>\
	                            </div>');
			//删除
            li.querySelector('.delete').addEventListener('touchend', function(e){
            	var li     = e.target.parentNode;
            	var fileId = li.getAttribute('id');
                _this.uploader.removeFile( fileId,true);//移除某一文件, 默认只会标记文件状态为已取消，如果第二个参数为 true 则会从 queue 中移除。
                _this.conf.parentNode.removeChild(li);
                _this.conf.deleteCallback(li, _this.conf.parentNode);
            }, false);

			if(this.conf.parentNode.lastChild == this.component[0]){
				this.conf.parentNode.appendChild(li);
			}else{
				this.conf.parentNode.insertBefore(li, this.component[0].nextSibling);
			}
		}
	});
	window.componentUpload = componentUpload;
})(jQuery,window);