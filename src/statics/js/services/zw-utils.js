'use strict';
angular.module('zw.utils',[])
.provider('zwUtils',[function(){
	Element && function(ElementPrototype) {
        ElementPrototype.matches = ElementPrototype.matches ||
          ElementPrototype.matchesSelector ||
          ElementPrototype.webkitMatchesSelector ||
          ElementPrototype.msMatchesSelector ||
          function(selector) {
              var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
              while (nodes[++i] && nodes[i] != node);
              return !!nodes[i];
          };
    }(Element.prototype);

/*********** fns start *************/
	this.randKey=function (len) {
	    len = len || 32;
	    var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	    var token = '';
	    for(var i = 0; i < len; i++) {
	      var j = parseInt(Math.random() * 62);
	      token += letters[j];
	    }
	    return token;
	}
	this.download=function (url){
	    if( typeof ( this.download.iframe ) == 'undefined' ){
	        var iframe = document.createElement('iframe');
	        this.download.iframe = iframe;
	        window.top.document.body.appendChild(this.download.iframe);
	    }
	    this.download.iframe.src = url;
	    this.download.iframe.style.display = "none";
	}
	this.parseIdCard=function (idcard){
	    var re = [],sexno,birthdayno;
	    if(idcard.length==18){
	        birthdayno=idcard.substring(6,14);
	        sexno=idcard.substring(16,17);
	    }else if(idcard.length==15){
	        birthdayno="19"+idcard.substring(6,12);
	        sexno=idcard.substring(14,15);
	    }else{
	        return false
	    }
	    re['birthday'] = birthdayno.substring(0,4) + "-" + birthdayno.substring(4,6) + "-" + birthdayno.substring(6,8);
	    if( sexno%2 == 0 ){
	        re['sex']="女";
	    }else{
	        re['sex']="男";
	    }
	    var myDate = new Date(); 
	    var month = myDate.getMonth() + 1; 
	    var day = myDate.getDate(); 
	    re['age'] = myDate.getFullYear() - birthdayno.substring(0, 4); 
	    if( parseInt( month + '' + day ) < parseInt( birthdayno.substring(4,8) )) 
	        re['age'] -= 1; 
	    return re;
	}
	this.date=function  ( format, timestamp ) {
	    var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date());
	    var pad = function(n, c){
	        if( (n = n + "").length < c ) {
	            return new Array(++c - n.length).join("0") + n;
	        } else {
	            return n;
	        }
	    };
	    var txt_weekdays = ["Sunday","Monday","Tuesday","Wednesday", "Thursday","Friday","Saturday"];        
	    var txt_ordin = {1:"st",2:"nd",3:"rd",21:"st",22:"nd",23:"rd",31:"st"};
	    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	    var f = {
	            d: function(){
	                return pad(f.j(), 2);
	            },
	            D: function(){
	                t = f.l(); return t.substr(0,3);
	            },
	            j: function(){
	                return jsdate.getDate();
	            },
	            l: function(){
	                return txt_weekdays[f.w()];
	            },
	            N: function(){
	                return f.w() + 1;
	            },
	            S: function(){
	                return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th';
	            },
	            w: function(){
	                return jsdate.getDay();
	            },
	            z: function(){
	                return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0;
	            },
	            W: function(){
	                var a = f.z(), b = 364 + f.L() - a;
	                var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;

	                if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){
	                    return 1;
	                } else{

	                    if(a <= 2 && nd >= 4 && a >= (6 - nd)){
	                        nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
	                        return date("W", Math.round(nd2.getTime()/1000));
	                    } else{
	                        return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
	                    }
	                }
	            },
	            F: function(){
	                return txt_months[f.n()];
	            },
	            m: function(){
	                return pad(f.n(), 2);
	            },
	            M: function(){
	                t = f.F(); return t.substr(0,3);
	            },
	            n: function(){
	                return jsdate.getMonth() + 1;
	            },
	            t: function(){
	                var n;
	                if( (n = jsdate.getMonth() + 1) == 2 ){
	                    return 28 + f.L();
	                } else{
	                    if( n & 1 && n < 8 || !(n & 1) && n > 7 ){
	                        return 31;
	                    } else{
	                        return 30;
	                    }
	                }
	            },
	            L: function(){
	                var y = f.Y();
	                return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0;
	            },
	            //o not supported yet
	            Y: function(){
	                return jsdate.getFullYear();
	            },
	            y: function(){
	                return (jsdate.getFullYear() + "").slice(2);
	            },
	            a: function(){
	                return jsdate.getHours() > 11 ? "pm" : "am";
	            },
	            A: function(){
	                return f.a().toUpperCase();
	            },
	            B: function(){
	                // peter paul koch:
	                var off = (jsdate.getTimezoneOffset() + 60)*60;
	                var theSeconds = (jsdate.getHours() * 3600) +
	                                 (jsdate.getMinutes() * 60) +
	                                  jsdate.getSeconds() + off;
	                var beat = Math.floor(theSeconds/86.4);
	                if (beat > 1000) beat -= 1000;
	                if (beat < 0) beat += 1000;
	                if ((String(beat)).length == 1) beat = "00"+beat;
	                if ((String(beat)).length == 2) beat = "0"+beat;
	                return beat;
	            },
	            g: function(){
	                return jsdate.getHours() % 12 || 12;
	            },
	            G: function(){
	                return jsdate.getHours();
	            },
	            h: function(){
	                return pad(f.g(), 2);
	            },
	            H: function(){
	                return pad(jsdate.getHours(), 2);
	            },
	            i: function(){
	                return pad(jsdate.getMinutes(), 2);
	            },
	            s: function(){
	                return pad(jsdate.getSeconds(), 2);
	            },
	            O: function(){
	               var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);
	               if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
	               return t;
	            },
	            P: function(){
	                var O = f.O();
	                return (O.substr(0, 3) + ":" + O.substr(3, 2));
	            },
	            c: function(){
	                return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P();
	            },
	            U: function(){
	                return Math.round(jsdate.getTime()/1000);
	            }
	    };
	    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){
	        if( t!=s ){
	            ret = s;
	        } else if( f[s] ){
	            ret = f[s]();
	        } else{
	            ret = s;
	        }
	        return ret;
	    });
	}
	
	this.parse_url=function (url) {  
	    var a =  document.createElement('a');  
	    a.href = url;  
	    var re = {  
	        source: url,  
	        protocol: a.protocol.replace(':',''),  
	        host: a.hostname,  
	        port: a.port,  
	        query: a.search,  
	        params: (function(){  
	            var ret = {},  
	            seg = a.search.replace(/^\?/,'').split('&'),  
	            len = seg.length, i = 0, s;  
	            for (;i<len;i++) {  
	                if (!seg[i]) { continue; }  
	                s = seg[i].split('=');  
	                ret[s[0]] = s[1];  
	            }  
	            return ret;  
	        })(),  
	        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],  
	        hash: a.hash.replace('#',''),  
	        path: a.pathname ? a.pathname.replace(/^([^\/])/,'/$1') : '',
	        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],  
	        segments: a.pathname.replace(/^\//,'').split('/')  
	    };
	    if(re.path && url.indexOf('http://')!=0 && url.indexOf('https://')!=0 && url.substr(0,1)!='/'){
	        re.path = re.path.replace(/^\//,'');
	    }
	    return re;
	}
	this.urlencode=function (clearString){  
	    var output = '';  
	    var x = 0;  
	    clearString = utf16to8(clearString.toString());  
	    var regex = /(^[a-zA-Z0-9-_.]*)/;  
	    while (x < clearString.length){  
	        var match = regex.exec(clearString.substr(x));  
	        if (match != null && match.length > 1 && match[1] != ''){  
	            output += match[1];  
	            x += match[1].length;  
	        }   
	        else{  
	            if (clearString[x] == ' ')  
	                output += '+';  
	            else{  
	                var charCode = clearString.charCodeAt(x);  
	                var hexVal = charCode.toString(16);  
	                output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();  
	            }  
	            x++;  
	        }  
	    }
	    function utf16to8(str){  
	        var out, i, len, c;  
	        out = "";  
	        len = str.length;  
	        for(i = 0; i < len; i++){  
	            c = str.charCodeAt(i);  
	            if ((c >= 0x0001) && (c <= 0x007F)){  
	                out += str.charAt(i);  
	            }   
	            else if (c > 0x07FF){  
	                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));  
	                out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));  
	                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));  
	            }   
	            else{  
	                out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));  
	                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));  
	            }  
	        }  
	        return out;  
	    }  
	    return output;  
	}
	this.urldecode=function (encodedString){  
	    var output = encodedString;  
	    var binVal, thisString,match;  
	    var myregexp = /(%[^%]{2})/;  
	    function utf8to16(str){  
	        var out, i, len, c;  
	        var char2, char3;  
	        out = "";  
	        len = str.length;  
	        i = 0;  
	        while(i < len){  
	            c = str.charCodeAt(i++);  
	            switch(c >> 4){   
	                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:  
	                out += str.charAt(i-1);  
	                break;  
	                case 12: case 13:  
	                char2 = str.charCodeAt(i++);  
	                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));  
	                break;  
	                case 14:  
	                char2 = str.charCodeAt(i++);  
	                char3 = str.charCodeAt(i++);  
	                out += String.fromCharCode(((c & 0x0F) << 12) |  
	                        ((char2 & 0x3F) << 6) |  
	                        ((char3 & 0x3F) << 0));  
	                break;  
	            }  
	        }  
	        return out;  
	    }  
	    while((match = myregexp.exec(output)) != null  
	                && match.length > 1  
	                && match[1] != '')  
	    {  
	        binVal = parseInt(match[1].substr(1),16);  
	        thisString = String.fromCharCode(binVal);  
	        output = output.replace(match[1], thisString);  
	    }  
	    //output = utf8to16(output);  
	    output = output.replace(/\\+/g, " ");  
	    output = utf8to16(output);  
	    return output;  
	}
	this.array_search=function (find,arr){
	    for(var i in arr){
	        if(arr[i] == find){
	            return i;break;
	        }
	    }
	    return false;
	}
	//arr.reverse() 只对索引数组有效
	this.array_reverse=function (arr){
	    if(arr instanceof Array){
	        var _arr = [],keys=[],values=[];
	        for(var i in arr){
	            keys.push(i);
	            values.push(arr[i]);
	        }
	        for(var j = keys.length -1;j>=0;j--){
	            _arr[keys[j]]=values[j];
	        }
	        return _arr;
	    }
	    return false;
	}
	//js 的 Array.join() 只对索引数组有效
	this.implode=function (sp,arr){
	    if(arr instanceof Array){
	        var str = '';
	        for(var i in arr){
	            str += sp + arr[i];
	        }
	        var re = new RegExp("^"+sp,"gim");
	        return str.replace(re,'');
	    }
	    return '';
	}
	this.http_build_query=function (formdata, numericPrefix, argSeparator) { // eslint-disable-line camelcase
	  var value;
	  var key;
	  var tmp = [];
	  var self = this;
	  var _httpBuildQueryHelper = function (key, val, argSeparator) {
	    var k
	    var tmp = []
	    if (val === true) {
	      val = '1'
	    } else if (val === false) {
	      val = '0'
	    }
	    if (val !== null) {
	      if (typeof val === 'object') {
	        for (k in val) {
	          if (val[k] !== null) {
	            tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator))
	          }
	        }
	        return tmp.join(argSeparator)
	      } else if (typeof val !== 'function') {
	        return self.urlencode(key) + '=' + self.urlencode(val)
	      } else {
	        throw new Error('There was an error processing for http_build_query().')
	      }
	    } else {
	      return ''
	    }
	  }
	  if (!argSeparator) {
	    argSeparator = '&'
	  }
	  for (key in formdata) {
	    value = formdata[key]
	    if (numericPrefix && !isNaN(key)) {
	      key = String(numericPrefix) + key
	    }
	    var query = _httpBuildQueryHelper(key, value, argSeparator)
	    if (query !== '') {
	      tmp.push(query)
	    }
	  }
	  return tmp.join(argSeparator)
	}
	this.serializeArray = function (form) {
	    var field, l, s = [];
	    if (typeof form == 'object' && form.nodeName == "FORM") {
	        var len = form.elements.length;
	        for (i=0; i<len; i++) {
	            field = form.elements[i];
	            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
	                if (field.type == 'select-multiple') {
	                    l = form.elements[i].options.length; 
	                    for (j=0; j<l; j++) {
	                        if(field.options[j].selected)
	                            s[s.length] = { name: field.name, value: field.options[j].value };
	                    }
	                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
	                    s[s.length] = { name: field.name, value: field.value };
	                }
	            }
	        }
	    }
	    return s;
	};
	this.serialize = function (form) {
	    var field, l, s = [];
	    if (typeof form == 'object' && form.nodeName == "FORM") {
	        var len = form.elements.length;
	        for (var i=0; i<len; i++) {
	            field = form.elements[i];
	            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
	                if (field.type == 'select-multiple') {
	                    l = form.elements[i].options.length; 
	                    for (var j=0; j<l; j++) {
	                        if(field.options[j].selected)
	                            s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
	                    }
	                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
	                    s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
	                }
	            }
	        }
	    }
	    return s.join('&').replace(/%20/g, '+');
	};
	this.msg = function(type,text,fn,time){
		time = time || 3000;
		fn = fn || function(){}; 
		var types={'error':'#ff8888','success':'#557755','info':'#90d1ff'};
		var tpl='<div id="app-msg"></div>';
		var str='#app-msg';
		if($(str,window.top.document.body).length < 1){
		    	$(window.top.document.body).append(tpl);
		}
		var $msg = $(str,window.top.document.body);
		$msg.text(text).css('background-color',types[type]);
		$msg.addClass('active');
		clearTimeout(this.msg.timer);
		this.msg.timer = setTimeout(function(){
			$msg.removeClass('active');
		    fn && fn();
		},time);
	};

/*********** fns end*************/

	this.$get = function(){
		return this;
	};
}]);








 
