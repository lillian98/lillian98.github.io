/* 晕染扩散 */
!function (window) {
    function Opa(cfg) {
        var config, util = App.Utils;
        this.config = util.merge({}, _default, cfg || {}), config = util.clone(this.config), this.get = function (key) {
            return config[key]
        }, this.set = function (key, val) {
            config[key] = val
        }, this.init()
    }
    /* 二级页面 */
    function secOpa(cfg){
        var config, util = App.Utils;
        this.config = util.merge({}, _default, cfg || {}), config = util.clone(this.config), this.get = function (key) {
            return config[key]
        }, this.set = function (key, val) {
            config[key] = val
        }, this.init()
    }

    window.App = window.App || {};
    var testn = 0,guideDom = document.getElementById('J_GuideTop');
    var _default = {page: "J_opaPage", pannel: "J_opaPannel"}, body = document.documentElement || document.body, EVENTS = {touchdown: "ontouchstart"in window ? "touchstart" : "mousedown", touchmove: "ontouchmove"in window ? "touchmove" : "mousemove", touchup: "ontouchend"in window ? "touchend" : "mouseup"}, userAgent = navigator.userAgent.toLowerCase(), browser = {version: userAgent.match(/(?:firefox|opera|safari|chrome|msie|applewebkit)[\/: ]([\d.]+)/)[1], safari: /version.+safari/.test(userAgent), chrome: /chrome/.test(userAgent), firefox: /firefox/.test(userAgent), ie: /msie/.test(userAgent), opera: /opera/.test(userAgent), webkit: /webkit/gi.test(userAgent)};
    App.Opa = App.Opa || Opa, App.secOpa = App.secOpa || secOpa, Opa.prototype = {init: function () {
        var len = 0;
        this.set("pageNode", document.getElementById(this.get("page")) || document.body), this.set("panNodes", this.get("pageNode").querySelectorAll("." + this.get("pannel"))), len = this.get("panNodes").length, this.set("vw", body.clientWidth > 750 ? 750 : body.clientWidth), this.set("vh", this.get("size").height || body.clientHeight), this.set("pb", document.querySelector("#J_PageBack")), this.set("current", 0), this.set("circle", !1), this.set("diff", 100), this.set("prefix", this.getPrefix(browser)), this.set("prevent", !1),this.set("sec-prevent", !1), this.set("sec-close-prevent", !1),this._parseNode(), !len || 2 > len || (this.preLoad(0), this.bindEvent(), this.pbEvent())
    }, getPrefix: function (brow) {
        var pre = "";
        return pre = browser.webkit ? "Webkit" : brow.firefox ? "Moz" : brow.msie ? "Ms" : brow.opera ? "O" : ""
    }, _parseNode: function () {
        var pn = this.get("pageNode"), pans = this.get("panNodes"), util = App.Utils;
        pn.style.width = this.get("vw") + "px", pn.style.height = this.get("vh") + "px", pn.style.left = "50%", pn.style.marginLeft = "-" + this.get("vw") / 2 + "px", pn.style.overflow = "hidden";
        for (var i = 0, len = pans.length; len > i; i++) {
            var item = pans.item(i);
            /* @fixme：不同 */
            item.style.position = "absolute", item.style.left = "0", item.style.top = "0", item.style.width = "100%", item.style.height = "100%", 0 !== i ? (item.style[this.get("prefix") + "Transform"] = "scale(2)", item.style.transform = "scale(2)", item.style.opacity = 0) : (util.addClass(item, "current"), util.addClass(item, "start-animate")), item.setAttribute("data-index", i)
        }
    }, resize: function () {
        var size = {width: body.clientWidth > 750 ? 750 : body.clientWidth, height: body.clientHeight}, pn = this.get("pageNode");
        this.set("vw", size.width), this.set("vh", size.height), pn.style.width = size.width + "px", pn.style.height = size.height + "px", pn.style.marginLeft = "-" + size.width / 2 + "px"
    }, getNext: function (index, flag) {
        var pans = this.get("panNodes"), len = pans.length, next = 0;
        return next = 1 === flag ? index + 1 == len ? 0 : index + 1 : 0 > index - 1 ? len - 1 : index - 1, pans[next]
    }, preLoad: function (currentIndex) {
        var pans = this.get("panNodes"), len = pans.length, ci = +currentIndex, nci = 0 > ci - 1 ? len - 1 : ci - 1, pci = ci + 1 > len - 1 ? 0 : ci + 1, lazys = null;
        pans[nci] && (lazys = pans[nci].querySelector(".J_MiLazyLoad"), lazys && (pans[nci].innerHTML = lazys.innerHTML)), pans[pci] && (lazys = pans[pci].querySelector(".J_MiLazyLoad"), lazys && (pans[pci].innerHTML = lazys.innerHTML))
    }, bindEvent: function () {
        function exchange(ev) {
            function moveHandler(ev) {
                /* 二级页面 */
                if(document.querySelector("#J_opaPage").className.indexOf('float-show')>-1 && document.querySelector("#J_opaPage").className.indexOf('float-show-') <0){
                    posObj = ev.touches ? ev.touches[0] : ev, 
                    move.y = posObj.clientY || posObj.pageY, 
                    disy = move.y - start.y;
                    curDom = ev.target.parentNode,
                    nowSecIndex = parseInt(curDom.getAttribute('data-sec-index')),
                    evtDom = curDom.parentNode,
                    nowSecDom = curDom.parentNode.querySelectorAll('.secene-sec'),
                    nowSecLength = nowSecDom.length;
                    //console.log('2这里是move事件 curDom',curDom,' nowSecIndex ', nowSecIndex, 'move.y', move.y, 'disy' ,disy,'nowSecLength' ,nowSecLength, 'evtDom' ,evtDom)
                        
                        if(Math.abs(disy)>20){
                            /* 下滑，上一页._this主线页面this:当前二级页 */
                            if(disy>0){

                                if(curDom == null || curDom == 'undefined'){
                                    _this.set("prevent", !1);
                                    return false;
                                }
                                //if(curDom.hasAttribute('data-sec-first')) {_this.set("sec-prevent",!1);return false;}
                                if(nowSecIndex > 0){
                                    nextIndex = nowSecIndex-1;
                                    next = nowSecDom[nextIndex];
                                    curDom.style[pre + "Transform"] = "scale(" + (1 + disy / vh) + ")", 
                                    curDom.style.transform = "scale(" + (1 + disy / vh) + ")", 
                                    curDom.style.opacity = 1 - disy / vh, 
                                    next.style[pre + "Transform"] = "scale(" + (2 - disy / vh) + ")", 
                                    next.style.transform = "scale(" + (2 - disy / vh) + ")", 
                                    next.style.opacity = -disy / vh;
                                    ev.preventDefault();
                                }
                                else{
                                    next = null
                                }
                            }
                            else{
                                if(curDom == null || curDom == 'undefined'){
                                    _this.set("prevent", !1);
                                    return false;
                                }
                                if(nowSecIndex < nowSecLength -1){
                                    nextIndex = nowSecIndex+1;
                                    next = nowSecDom[nextIndex];
                                    curDom.style[pre + "Transform"] = "scale(" + (1 + -disy / vh) + ")", 
                                    curDom.style.transform = "scale(" + (1 + -disy / vh) + ")", 
                                    curDom.style.opacity = 1 - -disy / vh, 
                                    next.style[pre + "Transform"] = "scale(" + (2 - -disy / vh) + ")", 
                                    next.style.transform = "scale(" + (2 - -disy / vh) + ")", 
                                    next.style.opacity = -disy / vh;
                                    ev.preventDefault();
                                }
                                else{
                                    next = null
                                }        
                            }
                        } 
                   // }
                }
                else{
_this.set("prevent", !1);
                    //console.log('target:',target,'<br>ev.target:',ev.target);
                    if(target){
                posObj = ev.touches ? ev.touches[0] : ev, move.y = posObj.clientY || posObj.pageY, disy = move.y - start.y, Math.abs(disy) > 20 && (disy > 0 ? target.getAttribute("data-index") > 0 ? (next = _this.getNext.call(_this, index, -1), target.style[pre + "Transform"] = "scale(" + (1 + disy / vh) + ")", target.style.transform = "scale(" + (1 + disy / vh) + ")", target.style.opacity = 1 - disy / vh, next.style[pre + "Transform"] = "scale(" + (2 - disy / vh) + ")", next.style.transform = "scale(" + (2 - disy / vh) + ")", next.style.opacity = disy / vh) : next = null : target.getAttribute("data-index") < len - 1 ? (next = _this.getNext.call(_this, index, 1), target.style[pre + "Transform"] = "scale(" + (1 + -disy / vh) + ")", target.style.transform = "scale(" + (1 + -disy / vh) + ")", target.style.opacity = 1 - -disy / vh, next.style[pre + "Transform"] = "scale(" + (2 - -disy / vh) + ")", next.style.transform = "scale(" + (2 - -disy / vh) + ")", next.style.opacity = -disy / vh) : next = null), ev.preventDefault();
                setTimeout(function(){App.Utils.removeClass(document.querySelector("#J_opaPage"), 'float-show-hide'),App.Utils.removeClass(document.querySelector("#J_opaPage"), 'float-show'),App.Utils.removeClass(document.querySelector('.current .float-mask .mc-wrap-detail'), 'float-wrap-show'),document.querySelector('.current .float-mask').style.zIndex=-1},400);
                    }
                }
            }

            function endHandler(ev) {
                if(document.querySelector("#J_opaPage").className.indexOf('float-show')>-1 && document.querySelector("#J_opaPage").className.indexOf('float-show-') <0){
                    ev.preventDefault();
                    /*curDom = ev.target.parentNode,
                        nowSecIndex = parseInt(curDom.getAttribute('data-sec-index')),
                        evtDom = curDom.parentNode,
                        nowSecDom = curDom.parentNode.querySelectorAll('.secene-sec'),
                        nowSecLength = nowSecDom.length;*/
                   //console.log('3这里是end处理 next',next,ev.target);

                    if(ev.target.className.indexOf('mc-wrap-back') > 0){
                        /* 关闭浮层 */
                        util.removeClass(document.querySelector('.current .float-mask .mc-wrap-detail'), 'float-wrap-show');
                        util.addClass(document.querySelector('.current .float-mask .mc-wrap-detail'), 'float-wrap-hide');
                        _this.set("sec-close-prevent",!0);
                        _this.set("prevent",!0);
                        setTimeout(function () {
                            document.querySelector('.current .float-mask').style.zIndex = -1;
                            util.removeClass(document.querySelector('.current .float-mask .mc-wrap-detail'), 'float-wrap-hide');
                            util.removeClass(_this.get('pageNode'), 'float-show');
                            document.querySelector('.current .float-mask .page-current') && util.removeClass(document.querySelector('.current .float-mask .page-current'), 'page-current');
                            document.querySelector('.current .float-mask .secene-sec-current') && util.removeClass(document.querySelector('.current .float-mask .secene-sec-current'), 'secene-sec-current');
                            _this.set("prevent",!1);_this.set("sec-prevent",!1);_this.set("sec-close-prevent", !1);
                        }, 600);
                        /* E 关浮层 */
                    }
                    else if(curDom == null || curDom == 'undefined'){
                        _this.set("prevent", !1);
                        //_this.set("sec-prevent", !1);
                    }
                    else{
                       posObj = ev.changedTouches ? ev.changedTouches[0] : ev, move.y = posObj.clientY || posObj.pageY, disy = move.y - start.y;
                        //console.log('这里是end处理,cur', curDom,'next',next)
                        if(next){
                            util.addClass(next, "has-transition"), util.addClass(curDom, "has-transition");
                            if(Math.abs(disy) > 20){
                                _this.set("sec-prevent", !0);
                                next.style[pre + "Transform"] = "scale(1)", next.style.transform = "scale(1)", next.style.opacity = 1, curDom.style[pre + "Transform"] = "scale(2)", curDom.style.transform = "scale(2)", curDom.style.opacity = 0/*, curcloseDom.style.opacity = 0*/, setTimeout(function () {
                                    tnext = next,tcur = curDom, tnext.style[pre + "Transform"] = "scale(1)", tnext.style.transform = "scale(1)", tnext.style.opacity = 1, tcur.style[pre + "Transform"] = "scale(2)", tcur.style.transform = "scale(2)", tcur.style.opacity = 0,util.removeClass(tcur, "secene-sec-current"), util.removeClass(tcur, "has-transition"), util.removeClass(document.querySelector('.current .float-mask .page-current'), "page-current"), util.addClass(document.querySelectorAll('.current .float-mask .icon')[nextIndex], "page-current"), util.addClass(tnext, "secene-sec-current"), util.removeClass(tnext, "has-transition") /*, curcloseDom.style.opacity = 1*/, _this.preLoad(tcur.getAttribute("data-sec-index")), _this.set("prevent", !1), _this.set("sec-prevent",!1),  _this.get("transEnd") && _this.get("transEnd").call(_this)}, 610);
                        }
                        else{
                            curDom.style[pre + "Transform"] = "scale(1)", curDom.style.transform = "scale(1)", curDom.style.opacity = 1, next.style[pre + "Transform"] = "scale(2)", next.style.transform = "scale(2)", next.style.opacity = 0, setTimeout(function () {
                        _this.set("prevent", !1), _this.set("sec-prevent",!1),util.removeClass(curDom, "has-transition"), util.removeClass(next, "has-transition")}, 600)
                        }
                    }
                    else{
                            if(Math.abs(disy) > 20 && !_this.get("sec-close-prevent")) {
                                /* 关浮层 */
                                util.removeClass(document.querySelector('.current .float-mask .mc-wrap-detail'), 'float-wrap-show');
                                util.addClass(document.querySelector('.current .float-mask .mc-wrap-detail'), 'float-wrap-hide');
                                util.removeClass(document.querySelector('.current .float-mask .page-current'), 'page-current');
                                /*for(var i = 0;i<document.querySelectorAll('.current .flaot-mask .icon').lenght;i++){
                                    util.removeClass(document.querySelectorAll[i], 'secene-sec-current');
                                }*/
                                //util.removeClass(document.querySelector('.current .float-mask .secene-sec-current'), 'secene-sec-current');
                                _this.set("sec-close-prevent",!0);
                                _this.set("prevent",!0);
                                setTimeout(function () {
                                    document.querySelector('.current .float-mask').style.zIndex = -1;
                                    util.removeClass(document.querySelector('.current .float-mask .mc-wrap-detail'), 'float-wrap-hide');
                                    util.removeClass(_this.get('pageNode'), 'float-show');
                                    /*document.querySelector('.current .float-mask .secene-sec-current') &&*/ util.removeClass(document.querySelector('.current .float-mask .secene-sec-current'), 'secene-sec-current');
                                    _this.set("prevent",!1);_this.set("sec-prevent",!1);_this.set("sec-close-prevent", !1);

                            }, 600);
                                /* E 关浮层 */
                            }
                            else{
                                _this.set("sec-prevent",!1)
                               //setTimeout(function(){_this.set("sec-prevent",!1);},620)
                            }
                            curDom.getAttribute("data-sec-index") == nowSecLength - 1 && _this.get("pb") && (_this.get("pbTimer") && (clearTimeout(_this.get("pbTimer")), _this.pbTimer = null), _this.get("pb").style.visibility = "visible", _this.get("pb").style.zIndex = 100, _this.get("pb").style.opacity = 1)
                        }
                        //console.log('我执行了吗',evtDom)
                        page.removeEventListener(EVENTS.touchmove, moveHandler, !1), page.removeEventListener(EVENTS.touchup, endHandler, !1);
                    }

                }
                /* E 没有二级页面 */
                /* S 没有二级页面 */
                else if(!_this.get('prevent')){
                    if(target){
                    aniTime = (index == 0)? 1600:800;
                    next ? (posObj = ev.changedTouches ? ev.changedTouches[0] : ev, move.y = posObj.clientY || posObj.pageY, disy = move.y - start.y, next = disy > 0 ? _this.getNext.call(_this, index, -1) : _this.getNext.call(_this, index, 1), util.addClass(next, "has-transition"), util.addClass(target, "has-transition"), Math.abs(disy) > _this.get("diff") ? (next.style[pre + "Transform"] = "scale(1)", next.style.transform = "scale(1)", next.style.opacity = 1, target.style[pre + "Transform"] = "scale(2)", target.style.transform = "scale(2)", target.style.opacity = 0, target.querySelector('.p-cir-imp.p-cir') && util.removeClass(target.querySelector('.p-cir-imp.p-cir'), "p-cir-imp"),target.querySelector('.p-cir-imp.p-text') && util.removeClass(target.querySelector('.p-cir-imp.p-text'), "p-cir-imp"),target.querySelector('.p-cir-imp.p-icon') && util.removeClass(target.querySelector('.p-cir-imp.p-icon'), "p-cir-imp"), setTimeout(function () {
                        util.removeClass(target, "current"), util.removeClass(target, "has-transition"), util.addClass(next, "current"), util.removeClass(next, "has-transition"), _this.preLoad(next.getAttribute("data-index")), _this.set("prevent", !1),_this.set("sec-prevent", !1), _this.get("transEnd") && _this.get("transEnd").call(_this),App.Utils.removeClass(document.querySelector("#J_opaPage"), 'float-show-hide'),App.Utils.removeClass(document.querySelector("#J_opaPage"),'float-show'),App.Utils.removeClass(target.querySelector('.float-mask .mc-wrap-detail'), 'float-wrap-show'),target.querySelector('.float-mask').style.zIndex=-1
                    }, 600),setTimeout(function(){next.querySelectorAll('.p-cir')[0] && util.addClass(next.querySelectorAll('.p-cir')[0],"p-cir-imp"),next.querySelectorAll('.p-text')[0] && util.addClass(next.querySelectorAll('.p-text')[0], "p-cir-imp"),next.querySelectorAll('.p-icon')[0] && util.addClass(next.querySelectorAll('.p-icon')[0],"p-cir-imp")},aniTime)) : (target.style[pre + "Transform"] = "scale(1)", target.style.transform = "scale(1)", target.style.opacity = 1, next.style[pre + "Transform"] = "scale(2)", next.style.transform = "scale(2)", next.style.opacity = 0, setTimeout(function () {
                        _this.set("prevent", !1), util.removeClass(target, "has-transition"), util.removeClass(next, "has-transition")
                    }, 600))) : (_this.set("prevent", !1), target.getAttribute("data-index") == len - 1 && _this.get("pb") && (_this.get("pbTimer") && (clearTimeout(_this.get("pbTimer")), _this.pbTimer = null), _this.get("pb").style.visibility = "visible", _this.get("pb").style.zIndex = 100, _this.get("pb").style.opacity = 1)), _this.set("sec-prevent", !1),page.removeEventListener(EVENTS.touchmove, moveHandler, !1), page.removeEventListener(EVENTS.touchup, endHandler, !1);
                    }
                }
                /* E 没有二级页面 */
            }
            if(document.querySelector("#J_opaPage").className.indexOf('float-show')>-1 && document.querySelector("#J_opaPage").className.indexOf('float-show-') <0){
                //console.log('继续怀疑吧',_this.get("sec-prevent"))
                if (_this.get("sec-prevent"))return!1;
                    _this.set("sec-prevent", !0);

                        var evtDom = this.querySelector('.current .mc-wrap-detail'),
                        nowSecDom = evtDom.querySelectorAll('.secene-sec'),
                        curDom = evtDom.querySelector('.secene-sec-current'),
                        nowSecIndex = parseInt(curDom.getAttribute('data-sec-index')),
                        nowSecLength = nowSecDom.length,
                        nextIndex =0,
                        next = null;
                    var disy = 0,
                        vh = _this.get("vh"),
                        posObj = ev.touches ? ev.touches[0] : ev;
                    start.y = posObj.clientY || posObj.pageY;
                //console.log('1这里绑定事件,start.y', start.y)
                page.addEventListener(EVENTS.touchmove, moveHandler, !1), page.addEventListener(EVENTS.touchup, endHandler, !1);
                }
                else{
                    if (_this.get("prevent"))return!1;
                    _this.set("prevent", !0);
                _this.set("sec-prevent", !1);
                    var target = page.querySelector(".current"),
                    index = +target.getAttribute("data-index"),
                    next = (_this.get("circle"), null),
                    disy = 0,
                    vh = _this.get("vh"),
                    posObj = ev.touches ? ev.touches[0] : ev;
                    start.y = posObj.clientY || posObj.pageY,
                    page.addEventListener(EVENTS.touchmove, moveHandler, !1), page.addEventListener(EVENTS.touchup, endHandler, !1)
                }
        }
if(document.querySelector("#J_opaPage").className.indexOf('float-show')>-1 && document.querySelector("#J_opaPage").className.indexOf('float-show-') <0){
     var _this = this, 
        util = App.Utils, 
        pre = (_this.get("current"), _this.get("prefix")), 
        curPage = document.querySelector("#J_opaPage").querySelector('.current .mc-wrap-detail'), 
        start = {x: 0, y: 0}, 
        move = {x: 0, y: 0}, 
        pans = _this.get("panNodes"), 
        len = pans.length;
        curPage.addEventListener(EVENTS.touchdown, exchange, !1), curPage.addEventListener(EVENTS.touchmove, function (ev) {
            
            ev.preventDefault()
        }, !1)
}
else{
     var _this = this, 
        util = App.Utils, 
        pre = (_this.get("current"), _this.get("prefix")), 
        page = _this.get("pageNode"), 
        start = {x: 0, y: 0}, 
        move = {x: 0, y: 0}, 
        pans = _this.get("panNodes"), 
        len = pans.length;
        page.addEventListener(EVENTS.touchdown, exchange, !1), page.addEventListener(EVENTS.touchmove, function (ev) {
            ev.preventDefault()
        }, !1)
}
       
    }, pbEvent: function () {
        function pbTouchStart(ev) {
            ev.preventDefault(), xyObj = ev.touches ? ev.touches[0] : ev, sy = xyObj.clientY || xyObj.pageY
        }

        function pbTouchEnd(ev) {
            ev.preventDefault(), xyObj = ev.changedTouches ? ev.changedTouches[0] : ev, ey = xyObj.clientY || xyObj.pageY, vdis = ey - sy, Math.abs(vdis) > 50 && vdis > 0 && (pb.style.opacity = 0, _this.set("pbTimer", setTimeout(function () {
                pb.style.visibility = "hidden", pb.style.zIndex = 100
            }, 520)))
        }

        var sy, ey, xyObj, vdis, _this = this, pb = _this.get("pb");
        return pb ? (pb.addEventListener(EVENTS.touchdown, pbTouchStart, !1), void pb.addEventListener(EVENTS.touchup, pbTouchEnd, !1)) : !1
    }}
}(window);