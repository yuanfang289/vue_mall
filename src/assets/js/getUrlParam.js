    // local操作
    const getUrlParam = function (name,type) {
      /*
       * 参数说明：
	   * type:  hash--》有#，？在#之后   search--》正常参数
       * name:key
	   * 因为锚点的缘故这里使用 window.location.hash  获取参数
       * */ 
	   const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	   if(type == 'hash'){
			const r = window.location.hash.split('?')[1]&&window.location.hash.split('?')[1].match(reg); //匹配目标参数
			if (r != null) return unescape(r[2]);
			return null; //返回参数值 
	   }else{
			let r0 = window.location.search.split('?')[1]&&window.location.search.split('?')[1].match(reg); //匹配目标参数
			if (r0 != null) return decodeURI(r0[2]);
			return null; //返回参数值
	   }
    };
    
    export {getUrlParam}
