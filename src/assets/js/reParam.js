// 该函数用于替换字符串中的某一个key的value值
 /*
       * 参数说明：
       * win：为某窗体或查询字符串
       * paramValue: 参数
	   * paramValue: 新值
	   * forceAdding: 不存在该参数时是否也指定 默认为true
       * */
	const reParam = function (url,arg,arg_val){
		var pattern=arg+'=([^&]*)'; 
	    var replaceText=arg+'='+arg_val; 
	    if(url.match(pattern)){ 
	        var tmp='/('+ arg+'=)([^&]*)/gi'; 
	        tmp=url.replace(eval(tmp),replaceText); 
	        return tmp; 
	    }else{ 
	        if(url.match('[\?]')){ 
	            return url+'&'+replaceText; 
	        }else{ 
	            return url+'?'+replaceText; 
	        } 
	    } 
	    return url+'\n'+arg+'\n'+arg_val;
	}
	
	export {reParam}
