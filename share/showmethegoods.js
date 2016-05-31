if (remixCss.styleSheet) {
    remixCss.styleSheet.cssText = styles;
} else {
    remixCss.appendChild(document.createTextNode(styles));
}
document.getElementsByTagName("head")[0].appendChild(remixCss);
}
pfClearNode("remix");
pfClearNode("tempImgs");
var imgs = document.getElementsByTagName("img"), data = [], htmlStr = '<ul class="rlist">', tis = document.createElement("div"), ch = document.documentElement.clientHeight, cw = document.documentElement.clientWidth, posx = cw / 2 - 100, posy = ch + document.body.scrollTop;
tis.id = "tempImgs";
for (var i = 0, len = imgs.length; i < len; i++) {
    var _ourl = imgs[i].getAttribute("src") || imgs[i].getAttribute("init_src") || imgs[i].getAttribute("back_src"), _item = {};
    if (!_ourl || _ourl.length < 1)return;
    var _idPatt = /-([0-9a-zA-Z]{32})\.0/, _id = _idPatt.exec(_ourl);
    if (_id) {
        _item.id = _id[1];
        _item.photo = _ourl.replace(/(^\s+)|(\s+$)/g, "").replace(/\.0\.(\S*\.)?jpg\S*$/, ".0.200x200.jpg");
        _item.org = imgs[i];
        _item.copycat = imgs[i].cloneNode(true);
        _item.copycat.className = "copycat";
        _item.copycat.style.top = pfGetXY(imgs[i]).top + "px";
        _item.copycat.style.left = pfGetXY(imgs[i]).left + "px";
        _item.link = "http://auction1.paipai.com/" + _item.id;
        tis.appendChild(_item.copycat);
        data.push(_item);
    }
}
if (data.length < 1)return;
document.body.appendChild(tis);
for (var i = 0, len = data.length; i < len; i++) {
    htmlStr += '<li class="ritem" id="id-' + data[i].id + '"><a href="' + data[i].link + '" target="_blank"><img src="' + data[i].photo + '" class="rphoto" style="-webkit-animation:bounceUp 0.6s ' + Math.random() + 's;" /></a></li>';
    data[i].copycat.style.cssText = "opacity:0;top:" + posy + "px;left:" + pfGetXY(data[i].org).left + "px;-webkit-transition:top " + parseInt(Math.random() * 5) + "s ease-out, opacity 1s;";
    data[i].org.style.cssText = "opacity:0;";
}
htmlStr += '</ul><i class="rclose" id="rclose"></i><ul id="rtemp"><ul>';
if (document.getElementById("remix")) {
    document.getElementById("remix").innerHTML = htmlStr;
} else {
    var _node = document.createElement("div");
    _node.className = "remix";
    _node.id = "remix";
    _node.innerHTML = htmlStr;
    document.body.appendChild(_node);
}
setTimeout(function () {
    document.getElementsByTagName('html')[0].className += " remixWrap";
}, 1000);
var _close = document.getElementById("rclose");
_close.onclick = removeMix;
var _rlist = document.querySelectorAll(".remix .ritem")
for (var j = 0, jlen = _rlist.length; j < jlen; j++) {
    _rlist[j].iid = _rlist[j].getAttribute("id").substring(3);
    _rlist[j].onmouseover = function () {
        var _ijson = "http://auction1.paipai.com/" + this.iid + ".1";
        if (!this.isLoad)pfAppendjs(_ijson);
        this.isLoad = 1;
    }
}
function removeMix() {
    document.getElementsByTagName('html')[0].className = document.getElementsByTagName('html')[0].className.replace(" remixWrap", "");
    pfClearNode("remix");
    cleaImg()
}
function cleaImg() {
    for (var i = 0, len = data.length; i < len; i++) {
        data[i].org.style.cssText = "opacity:1;";
    }
    pfClearNode("tempImgs");
}
}
function pfClearNode(id) {
    if (document.getElementById(id))document.body.removeChild(document.getElementById(id));
}
function pfGetXY(elem) {
    var top = 0, left = 0;
    do {
        top += elem.offsetTop || 0;
        left += elem.offsetLeft || 0;
        elem = elem.offsetParent;
    } while (elem);
    return{left: left, top: top};
}
function commodityJsonInfoCallBack() {
    var _iname = document.createElement("span");
    _iname.className = "rtitle";
    _iname.innerHTML = commodityInfo.name;
    var _iprice = document.createElement("span");
    _iprice.className = "rprice";
    _iprice.innerHTML = commodityInfo.price;
    if (document.getElementById("id-" + commodityInfo.sItemid)) {
        var _iiid = document.getElementById("id-" + commodityInfo.sItemid);
    } else {
        var _iiid = document.getElementById("id-" + commodityInfo.snapId);
    }
    var _imitem = _iiid.getElementsByTagName("a")[0];
    _imitem.appendChild(_iname);
    _imitem.appendChild(_iprice);
}
function pfAppendjs(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}
window['PP.foot.eggPlay'] = '21051:20130227:20130227132129';
window['PP.foot.eggPlay.time'] && window['PP.foot.eggPlay.time'].push(new Date());