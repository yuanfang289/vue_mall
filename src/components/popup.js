import Vue from 'vue'
import Popup1 from './popup.vue'

const PopupBox = Vue.extend(Popup1)

Popup1.install = function (data) {
	let a = document.getElementsByClassName("mask")[0]
	if(data){
		a&&a.remove();
		let instance = new PopupBox({
		  data
		}).$mount()
		
		document.body.appendChild(instance.$el)
		
		Vue.nextTick(() => {
		  if(!a){
			  instance.show = true
		  }else{
			  instance.show = data.show
		  }
		  // show 和弹窗组件里的show对应，用于控制显隐
		})
	}else{
		a&&a.remove();
	}
}

export default Popup1