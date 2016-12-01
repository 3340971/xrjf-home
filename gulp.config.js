var basePath = {
    "source" : 'source',
    "develop" : 'build/develop',
    "production" : 'build/production'
};
var resourcePath = {
    sass:   ['scss/*.scss'],
    css:    [
                './libs/normalize-css/normalize.css',
                './libs/fullpage.js/dist/jquery.fullpage.css',
                'statics/styles/*.css'
            ],
    js:     [
                './libs/jquery/dist/jquery.js',
                './libs/fullpage.js/dist/jquery.fullpage.js',
                './libs/gsap/src/minified/TweenMax.min.js',
                'statics/js/*.js'
            ],
    img:    ['statics/images/*.+(png|jpg|jpeg|gif|svg)'],
    fonts:  [
                './libs/bootstrap/fonts/*',
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
var browserSyncConfig = {
    server: {
        baseDir: ['./build/develop', './source']
    },
    port: 9999,
    files: [
        basePath.develop + destPath.css + '/*.css',
        basePath.develop + destPath.js + '/*.js',
        basePath.develop + destPath.img + '/**',
        basePath.develop + destPath.html + '/*.html'
    ]
};
module.exports = {
    basePath:basePath,
    resourcePath:resourcePath,
    destPath:destPath,
    browserSyncConfig:browserSyncConfig
};