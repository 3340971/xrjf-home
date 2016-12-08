var basePath = {
    "libs" : 'libs',
    "source" : 'src',
    "develop" : 'build/develop',
    "production" : 'build/production'
};
var copys = {
    libs1:{
        src:[
            basePath.libs + '/angular/angular.+(js|min.js)',
            basePath.libs + '/angular-animate/angular-animate.+(js|min.js)',
            basePath.libs + '/angular-ui-router/release/angular-ui-router.+(js|min.js)',
            basePath.libs + '/oclazyload/dist/ocLazyLoad.+(js|min.js)'
        ],
        options:{base : basePath.libs},
        dest: basePath.source + '/libs/angular'
    },
    libs2:{
        src:[
            basePath.libs + '/jquery/dist/jquery.+(js|min.js)'
        ],
        options:{base : basePath.libs},
        dest: basePath.source + '/libs/jquery'
    },
    libs3:{
        src:[
            basePath.libs + '/weui/dist/style/weui.+(css|min.css)'
        ],
        options:{base : basePath.libs},
        dest: basePath.source + '/libs'
    },
    libs4:{
        src:[
            basePath.libs + '/vConsole/dist/vconsole.min.js'
        ],
        options:{base : basePath.libs + '/vConsole/dist/'},
        dest: basePath.source + '/statics/js'
    }
};
var resourcePath = {
    sass:   ['scss/*.scss'],
    css:    [
                'libs/**/*.css',
                '!libs/**/*.min.css',
                'statics/styles/*.css'
            ],
    js:     [
                'libs/**/*.js',
                '!libs/**/*.min.js',
                'statics/js/*/*.js',
                'statics/js/home.js',
                'statics/js/home.config.js',
                'statics/js/home.config.router.js'
            ],
    img:    [
                'libs/**/*.+(png|jpg|jpeg|gif|svg)',
                'statics/images/*.+(png|jpg|jpeg|gif|svg)'
            ],
    fonts:  [
                'libs/**/*.+(eot|woff|ttf|svg)',
                'statics/fonts/*'
            ],
    html:   ['*.html'],
    tpl:    ['tpl/*.tpl']
};
var destPath = {
    css:    'statics/styles/',
    js:     'statics/js/',
    img:    'statics/images/',
    fonts:  'statics/fonts/',
    html:   '',
    tpl:    'tpl/'
};
module.exports = {
    copys:copys,
    basePath:basePath,
    resourcePath:resourcePath,
    destPath:destPath
};