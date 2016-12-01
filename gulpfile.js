//张伟 2016/12/01
var gulpConfig = function(basePath, resourcePath, destPath){
    if(!(this instanceof gulpConfig)){
        return new gulpConfig (basePath, resourcePath, destPath);
    }
    this.evr = '';
    this.mod = '';
    this.basePath = {};
    this.resourcePath = {}; 
    this.destPath = {}; 
    this.init = function(){
        var argv = require('yargs')
                    .options({
                        'd': {
                            alias: 'develop',
                            type: 'boolean'
                        }
                    }).argv;
        this.evr = argv.d  ? 'develop' : 'production' ;
        this.mod = argv.m;  
        this.basePath = basePath || {
            "source" : 'source',
            "develop" : 'build/develop',
            "production" : 'build/production',
        };
        this.resourcePath = resourcePath || {
            sass:   ['scss/*.scss'],
            css:    ['statics/css/*.css'],
            js:     ['statics/js/*.js'],
            img:    ['statics/images/*.+(png|jpg|jpeg|gif|svg)'],
            fonts:  ['statics/fonts/*'],
            html:   ['*.html'],
            tpl:    ['tpl/*.tpl']
        };
        this.destPath = destPath || {
            css:    'statics/css/',
            js:     'statics/js/',
            img:    'statics/images/',
            fonts:  'statics/fonts/',
            html:   '',
            tpl:    'tpl/'
        };
    };
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
    this.init();
};

var confJson  = require('./gulp.config.js'),
    gulp = require('gulp'),
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

var conf = gulpConfig(confJson.basePath, confJson.resourcePath, confJson.destPath);

gulp.task('server', function() {
    browserSync.init(confJson.browserSyncConfig);
});
gulp.task('clean', function() {
  return gulp.src([conf.getDest('css'), conf.getDest('js')], {read: false})
    .pipe(clean({force: true}))
    .pipe(notify({ message: '清空图片、样式、js complete' }));
});
var Build = {
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
    runSequence('clean','css','js','fonts','html',cb);
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