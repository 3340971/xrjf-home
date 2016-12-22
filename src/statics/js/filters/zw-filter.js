'use strict';
angular.module('zw.filter', ['zw.utils'])
.filter('str_replace', function(zwUtils) {  
    return function(input,arg1,arg2) {  
        return input.replace(new RegExp(arg1,'gm'),arg2); 
    };  
})
.filter('myDate', function(zwUtils) {  
    return function(input,arg1) {  
    	arg1 = arg1 || 'Y/m/d';
        return zwUtils.date(arg1, new Date(input).getTime()/1000); 
    };  
});