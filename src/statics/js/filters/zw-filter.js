'use strict';
angular.module('zw.filter', ['zw.utils'])
.filter('str_replace', function(zwUtils) {  
    return function(input,arg1,arg2) {  
        return input.replace(new RegExp(arg1,'gm'),arg2); 
    };  
})
.filter('date', function(zwUtils) {  
    return function(input,arg1) {  
        return zwUtils.date(arg1 || 'Y/m/d', input); 
    };  
}); ; 