'use strict';

app
.constant('JQ_CONFIG', {
        "validate":      [   	G.root + 'libs/jquery/jquery.validate.js',
        						G.root + 'libs/jquery/validate.expand.js']                      
    }
)
.constant('MODULE_CONFIG', {
        "ui.select":            [   G.root + 'statics/libs/angular/angular-ui-select/dist/select.min.js',
                                    G.root + 'statics/libs/angular/angular-ui-select/dist/select.min.css'],
        "angularFileUpload":    [   G.root + 'statics/libs/jquery/bootstrap-slider/bootstrap-slider.js',
                                    G.root + 'statics/libs/jquery/bootstrap-slider/bootstrap-slider.css']
    }
);