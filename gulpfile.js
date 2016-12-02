//张伟 2016/12/01
var parseConfig = function(){
    if(!(this instanceof parseConfig)){
        return new parseConfig ();
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
    //获取资源文件
    this.getFiles = function (type){
        if(typeof type == 'string'){
            type = [type];
        }
        var re = [];
        for(var i in type){
            var files = this.resourcePath[type[i]];
            for(var j in files){
                if(files[j].substring(0,2) == './'){
                    re.push(files[j]);
                }else{
                    re.push(this.basePath.source + '/' + files[j]);
                }
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
    browserSync = require('browser-sync').create();

var conf = parseConfig();

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: conf.get('basePath')[conf.evr]
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
    copy:function(){
        var copys = conf.copys;console.log(copys);
        for(var i in copys){
            gulp.src(copys[i].src, copys[i].options)
                .pipe(gulp.dest(copys[i].dest))
                .pipe(notify({ message: '复制依赖库' }));
        }
    },
    buildCss : function () {
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
                src = conf.getFiles('css');
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
    buildJs : function () {
        var src = conf.getFiles('js');console.log(src);
        var dest = conf.getDest('js');
        if(conf.evr != 'production'){
            return  gulp.src(src)
                        .pipe(concat('all.js'))
                        .pipe(gulp.dest(dest))
                        .pipe(notify({ message: '移动js到开发目录 complete' }));
        }else{
            return  gulp.src(src)
                        .pipe(concat('all.js'))
                        .pipe(rename({suffix:'.min'}))
                        .pipe(uglify())
                        .pipe(gulp.dest(dest))
                        .pipe(notify({ message: 'js合并、压缩到生产目录 complete' }));
        }
    },
    buildImg: function () {
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
    buildFonts: function(){
    	var src = conf.getFiles('fonts');
        var dest = conf.getDest('fonts');
        return gulp.src(src)
	        .pipe(gulp.dest(dest))
	        .pipe(notify({ message: '移动fonts到开发目录和生产目录 complete' }));
    },
    buildHtml: function(){
    	var src = conf.getFiles('html');
        var dest = conf.getDest('html');
        return gulp.src(src)
	        .pipe(gulp.dest(dest))
	        .pipe(notify({ message: '移动html到开发目录和生产目录 complete' }));
    }
};
gulp.task('copy',function(){
    return Build.copy();
});

gulp.task('js',function(){
	return Build.buildJs();
});
gulp.task('css',function(){
	return Build.buildCss();
});
gulp.task('img',function(){
	return Build.buildImg();
});
gulp.task('fonts', function() {
    return Build.buildFonts();
});
gulp.task('html', function() {
    return Build.buildHtml();
});

gulp.task('build',function(cb){
    runSequence('clean','copy','css','js','fonts','html',cb);
    gulp.watch(conf.getFiles('sass'), ['css'], browserSync.reload);
    gulp.watch(conf.getFiles('js'), ['js'], browserSync.reload);
    gulp.watch(conf.getFiles('fonts'), ['fonts'], browserSync.reload);
    gulp.watch(conf.getFiles('html'), ['html'], browserSync.reload);
});

gulp.task('help',function () {
    console.log('   gulp help           gulp参数说明');
    console.log('   gulp img            图片复制');
    console.log('   gulp -d             开发环境');
});
gulp.task('default',function(cb){
	runSequence('build', 'server', 'help', cb);
});