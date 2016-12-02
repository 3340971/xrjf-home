var basePath = {
    "libs" : 'libs',
    "source" : 'src',
    "develop" : 'build/develop',
    "production" : 'build/production'
};
var copys = {
    libs1:{
        src:[
            basePath.libs + '/angular/angular.js',
            basePath.libs + '/angular-animate/angular-animate.js',
            basePath.libs + '/angular-ui-router/release/angular-ui-router.js'
        ],
        options:{base : basePath.libs},
        dest: basePath.source + '/statics/libs/angular'
    },
    libs2:{
        src:[
            basePath.libs + '/jquery/dist/jquery.js'
        ],
        options:{base : basePath.libs},
        dest: basePath.source + '/statics/libs/jquery'
    },
    libs3:{
        src:[
            basePath.libs + '/weui/dist/style/weui.css'
        ],
        options:{base : basePath.libs},
        dest: basePath.source + '/statics/libs'
    }
};
var resourcePath = {
    sass:   ['scss/*.scss'],
    css:    [
                'statics/libs/**/*.css',
                'statics/styles/*.css'
            ],
    js:     [
                'statics/libs/**/*.js',
                'statics/js/home.js',
                'statics/js/home.config.js',
                'statics/js/home.config.router.js'
            ],
    img:    [
                'statics/libs/**/*.+(png|jpg|jpeg|gif|svg)',
                'statics/images/*.+(png|jpg|jpeg|gif|svg)'
            ],
    fonts:  [
                'statics/libs/**/*.+(eot|woff|ttf|svg)',
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