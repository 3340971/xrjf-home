'use strict';

app
.constant('JQ_CONFIG', {
        "filestyle":      [   	G.root + 'statics/libs/jquery/bootstrap-filestyle/src/bootstrap-filestyle.js'],
        "slider":         [   	G.root + 'statics/libs/jquery/bootstrap-slider/bootstrap-slider.js',
                          		G.root + 'statics/libs/jquery/bootstrap-slider/bootstrap-slider.css']
                      
    }
)
.constant('MODULE_CONFIG', {
        "ui.select":            [   G.root + 'statics/libs/angular/angular-ui-select/dist/select.min.js',
                                    G.root + 'statics/libs/angular/angular-ui-select/dist/select.min.css'],
        "angularFileUpload":    [   G.root + 'statics/libs/jquery/bootstrap-slider/bootstrap-slider.js',
                                    G.root + 'statics/libs/jquery/bootstrap-slider/bootstrap-slider.css']
    }
);