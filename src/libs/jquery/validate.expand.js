//张伟
if( jQuery.validator instanceof Object ){
    jQuery.validator.setDefaults({
        debug:false,
        success: function ( label, element ) {
            var callback = $(element).attr('success');
            callback && eval(callback)(element.value,element);
        }
    });
    jQuery.validator.addMethod("isLoginName", function(value, element) {
        var username = /^[a-zA-Z0-9]{5,16}$/;
        return this.optional(element) || (username.test(value));
    }, "用户名格式不正确,5-16个字符");
    jQuery.validator.addMethod("zhRangeLength", function(value, element, param) {
        var length = value.length;
        param = eval(param);
        var zh = /^[\u4E00-\u9FA5\uf900-\ufa2d㤖]+$/;
        return this.optional(element) || ( length >= param[0] && length <= param[1] && zh.test(value) );
    }, jQuery.validator.format("请输入{0}-{1}个中文"));
    jQuery.validator.addMethod("isMobile", function(value, element) {
        var mobile = /^1[34578][0-9]{9}$/;
        return this.optional(element) || (mobile.test(value));
    }, "错误的手机号格式");
    jQuery.validator.addMethod("isFloat", function(value, element) {
        var float = /^(([^0]\d*)|0)(\.\d{1,2})?$/;
        return this.optional(element) || (float.test(value));
    }, "不是合法的浮点数值");
    jQuery.validator.addMethod("isIdCardNo",function(value, element){
        if(this.optional(element))return true;
        return isIdCardNo(value, element);
    }, "身份证格式错误");
    jQuery.validator.addMethod("isHuZhao",function(value, element){
        var re = /^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/;
        return this.optional(element) || (re.test(value));
    }, "护照格式错误");
    jQuery.validator.addMethod("fn", function(value, element, param) {
        //if(this.optional(element))return true;
        if(typeof(eval(param))=='function'){
            var re = eval(param)(value,element,this.currentForm);
            if(re === false){
                if($(element).attr('fn-error')) $.validator.messages['fn'] = $(element).attr('fn-error');
                return false;
            }else{
                return true;
            }
        }else{
            $.validator.messages['fn'] = '验证函数不存在';
            return false;
        }
    });
    //ajax验证
    jQuery.validator.addMethod("ajax", function(value, element, param) {
        if(this.optional(element))return true;
        var url = param,
            type =$(element).attr('ajax-type') || 'post',
            dataType =$(element).attr('ajax-datatype') || 'json',
            data =$(element).attr('name') + '=' + value;
        data += $(element).data('data') ? '&' + $(element).data('data') : '';
        var flag = false;
        var validator = this;
        $.ajax({
            url : param,
            dataType : dataType,
            async : false,
            data : data,
            type : type,
            cache : false,
            success : function(response){
                if( Boolean(response.code) ){
                    flag = true;
                }else{
                    $.validator.messages['ajax'] = response.message;
                }
            }
        });
        return flag;
    });

    //兼容旧版的
    jQuery.validator.addMethod("isPhone", function(value, element) {
        var mobile = /^1[34578][0-9]{9}$/;
        return this.optional(element) || (mobile.test(value));
    }, "错误的手机号格式");
}


function isIdCardNo(value, element) {
	var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];
	var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];
	if (value.length == 15) {
		return isValidityBrithBy15IdCard(value);
	}else if (value.length == 18){
		var a_idCard = value.split("");
		if (isValidityBrithBy18IdCard(value)&&isTrueValidateCodeBy18IdCard(a_idCard)) {
			return true;
		}
		return false;
	}
	return false;
	function isTrueValidateCodeBy18IdCard(a_idCard) {
		var sum = 0;
		if (a_idCard[17].toLowerCase() == 'x') {
			a_idCard[17] = 10;
		}
		for ( var i = 0; i < 17; i++) {
			sum += Wi[i] * a_idCard[i];
		}
		var valCodePosition = sum % 11;
		if (a_idCard[17] == ValideCode[valCodePosition]) {
			return true;
		}
		return false;
	}
	function isValidityBrithBy18IdCard(idCard18){
		var year = idCard18.substring(6,10);
		var month = idCard18.substring(10,12);
		var day = idCard18.substring(12,14);
		var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
		if(temp_date.getFullYear()!=parseFloat(year) || temp_date.getMonth()!=parseFloat(month)-1 || temp_date.getDate()!=parseFloat(day)){
			return false;
		}
		return true;
	}
	function isValidityBrithBy15IdCard(idCard15){
		var year =  idCard15.substring(6,8);
		var month = idCard15.substring(8,10);
		var day = idCard15.substring(10,12);
		var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
		if(temp_date.getYear()!=parseFloat(year) || temp_date.getMonth()!=parseFloat(month)-1 || temp_date.getDate()!=parseFloat(day)){
			return false;
		}
		return true;
	}
}