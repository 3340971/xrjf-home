'use strict';

app
.constant('JQ_CONFIG', {
        "validate":      [   	'libs/jquery/jquery.validate.js',
        						'libs/jquery/validate.expand.js']                      
    }
)
.constant('MODULE_CONFIG', {
        "ui.select":            [   'statics/libs/angular/angular-ui-select/dist/select.min.js',
                                    'statics/libs/angular/angular-ui-select/dist/select.min.css'],
        "angularFileUpload":    [   'statics/libs/jquery/bootstrap-slider/bootstrap-slider.js',
                                    'statics/libs/jquery/bootstrap-slider/bootstrap-slider.css']
    }
);