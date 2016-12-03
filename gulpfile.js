//张伟 2016/12/01
var parseConfig = function(){
    if(!(this instanceof parseConfig)){
        return new parseConfig ();
    }
    function inArray(needle,array){    
        if(typeof needle=="string"||typeof needle=="number"){    
            var len=array.length;    
            for(var i=0;i<len;i++){    
                if(needle===array[i]){    
                    return true;    
                }    
            }    
            return false;    
        }    
    }
    this.conf = require('./gulp.config.js');
    this.evr = '';
    this.mod = '';
    this.basePath = {};
    this.resourcePath = {}; 
    this.destPath = {};
    this.copys = this.conf.copys || {};
    this.init = function(){
        var argv = require('yargs')
                    .options({
                        'd': {
                            alias: 'develop',
                            type: 'boolean'
                        },
                        'm':{
                            alias: 'module',
                            type: 'string',
                            default : 'all'
                        }
                    }).argv;
        this.evr = argv.d  ? 'develop' : 'production' ;
        this.mod = argv.m;    
        this.basePath = this.conf.basePath || {};
        this.resourcePath = this.conf.resourcePath || {};
        this.destPath = this.conf.destPath || {};
    };
    this.getFiles = function (type){
        if(typeof type == 'string'){
            type = [type];
        }
        var re = [];
        for(var i in type){
            var files = this.resourcePath[type[i]];
            for(var j in files){
                var exclude = files[j].substring(0,1) == '!' ? true : false,
                    file = exclude ? files[j].substring(1) : files[j];
                if(file.substring(0,2) == './'){
                    file = files[j];
                }else{
                    file = this.basePath.source + '/' +file;
                    file = exclude ? ('!' + file) : file; 
                }
                re.push(file);
            }
        }
        return re;
    };
    this.getDest = function (type, baseType){
        if(!baseType) baseType = this.evr;
        return this.basePath[baseType] + '/' + this.destPath[type];
    };
    this.getRoot = function (){
        return this.basePath[this.evr];
    };
    this.getList = function(src){
        var glob = require('glob');
        var list = [],exclude = [];
        if(src instanceof Array){
            for(var i in src){
                if(src[i].substring(0,1) == '!'){
                    exclude = exclude.concat(glob.sync(src[i].substring(1)));
                }else{
                    list = list.concat(glob.sync(src[i]));
                }
            }
            for(var i in list){
                if(inArray(list[i], exclude)){
                    delete list[i];
                }
            }
        }else{
            if(src[i].substring(0,1) != '!'){
                list = list.concat(glob.sync(src[i]));
            }
        }
        return list;
    }
    this.get = function(key){
        return this.conf[key];
    }
    this.init();
};

var gulp = require('gulp'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence'),
    ngAnnotate = require('gulp-ng-annotate'),
    browserSync = require('browser-sync').create();
var conf = parseConfig();
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: 'src/'//conf.get('basePath')[conf.evr]
        },
        port: 9999
    });
});
gulp.task('clean', function() {
  return gulp.src([conf.getDest('css'), conf.getDest('js')], {read: false})
    .pipe(clean({force: true}))
    .pipe(notify({ message: '清空图片、样式、js complete' }));
});
var Build = {
    copy:function(cb){
        var copys = conf.copys,
            stream;
        for(var i in copys){
            stream = gulp.src(copys[i].src, copys[i].options)
                .pipe(gulp.dest(copys[i].dest))
                .pipe(notify({ message: '复制依赖库' }));
        }
        return stream;
    },
    buildCss : function (cb) {
        var autopre = autoprefixer({
                        browsers: ['last 5 versions', 'Android >= 4.0'],
                        cascade: true,
                        remove:true
                    });
        var src = conf.getFiles('sass');
        var dest = conf.getDest('css','source');
        return gulp.src(src)
            .pipe(sass())
            .pipe(gulp.dest(dest))
            .pipe(notify({ message: 'sass解析 complete' }))
            .on('end',function(){
                src = conf.getFiles('css');console.log(conf.getList(src));
                dest = conf.getDest('css');
                if(conf.evr != 'production'){
                    return gulp.src(src)
                                .pipe(autopre)
                                .pipe(concat('all.css'))
                                .pipe(gulp.dest(dest))
                                .pipe(notify({ message: 'css复制 complete' }));
                }else{
                    return gulp.src(src)
                                .pipe(autopre)
                                .pipe(concat('all.css'))
                                .pipe(rename({suffix:'.min'}))
                                .pipe(minifycss())
                                .pipe(gulp.dest(dest))
                                .pipe(notify({ message: 'css合并、压缩到生产目录 complete' }));
                }
            });
    },
    buildJs : function (cb) {
        var src = conf.getFiles('js');console.log(conf.getList(src));
        var dest = conf.getDest('js');
        if(conf.evr != 'production'){
            return  gulp.src(src)
                        .pipe(concat('all.js'))
                        .pipe(ngAnnotate())
                        .pipe(gulp.dest(dest))
                        .pipe(notify({ message: '移动js到开发目录 complete' }));
        }else{
            return  gulp.src(src)
                        .pipe(concat('all.js'))
                        .pipe(ngAnnotate())
                        .pipe(rename({suffix:'.min'}))
                        .pipe(uglify())
                        .pipe(gulp.dest(dest))
                        .pipe(notify({ message: 'js合并、压缩到生产目录 complete' }));
        }
    },
    buildImg: function (cb) {
        var src = conf.getFiles('img');
        var dest = conf.getDest('img');
        if(conf.evr != 'production'){
            return  gulp.src(src)
                        .pipe(gulp.dest(dest))
                        .pipe(notify({ message: '移动img到开发目录 complete' }));
        }else{
            return  gulp.src(src)
                        .pipe(imagemin({
                            progressive: true,
                            use: [pngquant()]
                        }))
                        .pipe(gulp.dest(dest))
                        .pipe(notify({ message: 'images压缩到生产目录 complete' }));
        }
    },
    buildFonts: function(cb){
    	var src = conf.getFiles('fonts');
        var dest = conf.getDest('fonts');
        return gulp.src(src)
	        .pipe(gulp.dest(dest))
	        .pipe(notify({ message: '移动fonts到开发目录和生产目录 complete' }));
    },
    buildHtml: function(cb){
    	var src = conf.getFiles('html');
        var dest = conf.getDest('html');
        return gulp.src(src)
	        .pipe(gulp.dest(dest))
	        .pipe(notify({ message: '移动html到开发目录和生产目录 complete' }));
    }
};
gulp.task('copy',function(cb){
    return Build.copy(cb);
});
gulp.task('js',function(cb){
    return Build.buildJs(cb);
});
gulp.task('css',function(cb){
    return Build.buildCss(cb);
});
gulp.task('img',function(cb){
    return Build.buildImg(cb);
});
gulp.task('fonts', function(cb) {
    return Build.buildFonts(cb);
});
gulp.task('html', function(cb) {
    return Build.buildHtml(cb);
});
gulp.task('build',function(cb){
    runSequence('clean','css','js','fonts','html',cb);
    gulp.watch(conf.getFiles('sass'), ['css'], browserSync.reload);
    gulp.watch(conf.getFiles('js'), ['js'], browserSync.reload);
    gulp.watch(conf.getFiles('fonts'), ['fonts'], browserSync.reload);
    gulp.watch(conf.getFiles('html'), ['html'], browserSync.reload);
});
gulp.task('help',function () {
    console.log('   gulp help           gulp参数说明');
    console.log('   gulp copy           库文件复制');
    console.log('   gulp img            图片复制');
    console.log('   gulp -d             开发环境');
});
gulp.task('default',function(cb){
	runSequence('build', 'server', 'help', cb);
});