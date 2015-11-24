var timer=function(){
	timer.getTime();
}
timer.getTime=function(){
	 $.ajax({
        type: "get",
        cache : false,
        async:true,
        url: "http://www.jd.ru/time/get",
        dataType: "jsonp",
        success:function(result){
        	servertimehandle(result);
        }
   })  
}
timer.changeTime=function(st){
	var seletor=$('.timer');
	var endTime=seletor.attr('dataendtime');
	var eTime=new Date(endTime).getTime();//结束时间
	var sTime=st*1000;//服务器时间
	var nTime=new Date().getTime();//本地时间
	var tDif=nTime-sTime;//时间差
	
	function setTime(){
		var nTime=new Date().getTime()-tDif;
		var t=eTime-nTime;

		if(t>0){
			var d=timer.zerofill(Math.floor(t/(1000*60*60*24)));
			var h=timer.zerofill(Math.floor(t/1000/60/60%24));
		    var m=timer.zerofill(Math.floor(t/1000/60%60));
		    var s=timer.zerofill(Math.floor(t/1000%60));
			seletor.find('.iDay').html(d);
			seletor.find('.iHour').html(h);
			seletor.find('.iMinute').html(m);
			seletor.find('.iSeconds').html(s);
			setTimeout(setTime,100);
		}
	}
	setTime();
}
timer.zerofill=function(s) {
  return s < 10 ? '0' + s: s;
}
function servertimehandle(data){
	var sTime=data.time;//服务器时间
	timer.changeTime(sTime);
}

var tmpStartY,tmpEndY=0;
var canMove=false;
function startTouch(event) {
    tmpStartY = event.changedTouches[0].clientY;
    return false;
}

function moveTouch(event) {
    // event.preventDefault(); 
    // event.stopPropagation();
    tmpEndY = event.targetTouches[0].clientY;
}

// 触摸结束时判断执行上翻或者下翻
function endTouch(event) {
	alert(tmpEndY)
	if(tmpEndY && tmpEndY !== tmpStartY && tmpEndY-tmpStartY>0){
		$('.ticketWrap').addClass('active');
	}else{
		$('.ticketWrap').removeClass('active');
	}
}

$('.f-wrap').on("touchstart",function(e){
    startTouch(e);
}).on("touchmove",function(e){
    moveTouch(e);
}).on("touchcancel",function(e){
    endTouch(e);
}).on("touchend",function(e){
    endTouch(e);
});		
 var browser={
    versions:function(){
           var u = navigator.userAgent, app = navigator.appVersion;
           return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
         }(),
         language:(navigator.browserLanguage || navigator.language).toLowerCase()
}
alert(navigator.userAgent);
$(function(){
	var myTimer=new timer();
})	