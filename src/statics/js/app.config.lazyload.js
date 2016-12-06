'use strict';

app
.constant('JQ_CONFIG', {
        "validate":      [   	G.public + 'libs/jquery/jquery.validate.js',
        						G.public + 'libs/jquery/validate.expand.js']                      
    }
)
.constant('MODULE_CONFIG', {
        "ui.select":            [   G.public + 'statics/libs/angular/angular-ui-select/dist/select.min.js',
                                    G.public + 'statics/libs/angular/angular-ui-select/dist/select.min.css'],
        "angularFileUpload":    [   G.public + 'statics/libs/jquery/bootstrap-slider/bootstrap-slider.js',
                                    G.public + 'statics/libs/jquery/bootstrap-slider/bootstrap-slider.css']
    }
);