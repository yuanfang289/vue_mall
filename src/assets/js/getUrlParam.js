    // local操作
    const getUrlParam = function (name) {
      /*
       * 参数说明：
       * name:key
       * */ 
	   
	   const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	   const r = window.location.hash.split('?')[1]&&window.location.hash.split('?')[1].match(reg); //匹配目标参数
	   if (r != null) return unescape(r[2]);
	   return null; //返回参数值
    };
    
    export {getUrlParam}
