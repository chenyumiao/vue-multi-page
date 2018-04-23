//公用方法
var Rxport = {

	common_alert(){
		alert(1);
	},
  resize_rem(){
    var rootHtml = document.documentElement,
      deviceWidth = rootHtml.clientWidth;
    if(deviceWidth > 640){
      deviceWidth = 640;
    }
    rootHtml.style.fontSize = deviceWidth / 7.5 + "px";
  },
  window_font_size(){
    Rxport.resize_rem();
    window.addEventListener("resize", Rxport.resize_rem(), false);
    window.addEventListener("orientationchange", Rxport.resize_rem(), false);
  }
}

export default Rxport;
