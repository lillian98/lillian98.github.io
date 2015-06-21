/* 同页面处理 */
!function (window) {
    function Opa(cfg) {
        var config;
        this.config = Utils.merge({}, _default, cfg || {}), config = Utils.clone(this.config), this.get = function (key) {
            return config[key]
        }, this.set = function (key, val) {
            config[key] = val
        }, this.init()
    }
    var curHash = window.location.hash;
    var curPageNo = (curHash!='')?parseInt(curHash.split('=')[1]):0;
    console.log('111',curHash,curHash.split('=')[1])
    window.App = window.App || {};
    var _default = {
        page: "J_opaPage", dragger: "J_opaScroll", pannel: "J_opaPannel", transEnd: function () {
        }
    }, body = document.documentElement || document.body, Utils = App.Utils, css3Surport = function () {
        var obj = {}, div = document.createElement("div"), style = div.style;
        return obj.prefix = "WebkitTransition"in style ? "webkit" : "oTransition"in style ? "o" : "msTransition"in style ? "ms" : "", obj
    }, EVENTS = {
        touchdown: "ontouchstart"in window ? "touchstart" : "mousedown",
        touchmove: "ontouchmove"in window ? "touchmove" : "mousemove",
        touchup: "ontouchend"in window ? "touchend" : "mouseup"
    };
    Opa.prototype = {
        init: function () {
            this.set("pageNode", document.querySelector("#" + this.get("page"))), this.set("pannels", this.get("pageNode").querySelectorAll("." + this.get("pannel"))), this.set("count", this.get("pannels").length), this.set("offset", {
                left: 0,
                top: 0
            }), this.get("size") ? (this.set("vw", this.get("size").width || (body.clientWidth > 750 ? 750 : body.clientWidth)), this.set("vh", this.get("size").height || body.clientHeight)) : (this.set("vw", body.clientWidth > 750 ? 750 : body.clientWidth), this.set("vh", body.clientHeight)), this.set("prefix", css3Surport().prefix), this.get("prefix") ? this.set("transform", this.get("prefix") + "Transform") : this.set("transform", "transform"), this.set("guideTop", document.querySelector("#J_GuideTop")), this.set("prevent", !1), this.parsePannel(), this.preload(0), this.bindEvent();
            this.get("pageNode").className = "page ani-" + curPageNo;
            /*for(var i = 0;i<=curPageNo;i++){
                this.get("pageNode").className = this.get("pageNode").className + " ani-"+i
            }*/
        }, parsePannel: function () {
            var source, music, scon, _this = this, pn = _this.get("pageNode"), pans = _this.get("pannels"), len = _this.get("count"), animationName = _this.get("prefix") ? _this.get("prefix") + "AnimationName" : "animationName";
            _this.get("guideTop").style[animationName] = "fadeInRight", _this.get("guideTop").className += " mi-fadeInRight", _this.get("guideTop").style.bottom = "20px", _this.get("guideTop").style.backgroundImage = "url(http://img14.360buyimg.com/cms/jfs/t469/88/1194341676/1288/7f287e8b/54b8a9bbN68de03ce.png)", pn.style.position = "absolute", pn.style.left = "50%", pn.style.marginLeft = "-" + _this.get("vw") / 2 + "px";
            for (var i = 0; len > i; i++)pans[i].setAttribute("data-index", i), pans[i].style.position = "absolute", pans[i].style.top = "0", pans[i].style.left = "0",pans[i].style.width = _this.get("vw") + "px", pans[i].style.height = "100%", curPageNo == i && (Utils.addClass(pans[i], "current"), Utils.addClass(pans[i], "start-animate"));
            pn.querySelector("#" + _this.get("dragger")) ? (pn.querySelector("#" + _this.get("dragger")).style.width = 100 * len + "%", pn.querySelector("#" + _this.get("dragger")).style.height = "100%") : (source = pn.innerHTML, music = source.replace(/<div\sclass="J_opaPannel(.|\n|\r)*<\/div>/g, ""), scon = source.replace(/<div\sclass="music\-anim"(.|\n|\r)*?(<div\sclass="J_opaPannel)/g, "$2"), pn.innerHTML = music + '<div id="' + _this.get("dragger") + '" class="page-scroller" style="width:' + 100 * len + '%;height: 100%;">' + scon + "</div>"), _this.set("dragger", document.querySelector("#" + _this.get("dragger"))), _this.set("pannels", pn.querySelectorAll("." + _this.get("pannel")))
        }, preload: function (index) {
            var pans = this.get("pannels"), nextIndex = index + 1;
            pans[nextIndex] && pans[nextIndex].querySelector(".J_MiLazyLoad") && (pans[nextIndex].innerHTML = pans[nextIndex].querySelector(".J_MiLazyLoad").innerHTML)
        }, hasNext: function (currentNodeIndex, flag) {
            var pans = this.get("pannels");
            return -1 == flag ? pans[currentNodeIndex - 1] : pans[currentNodeIndex + 1]
        }, resize: function () {
            var size = {
                width: body.clientWidth > 750 ? 750 : body.clientWidth,
                height: body.clientHeight
            }, pn = this.get("pageNode");
            this.set("vw", size.width), this.set("vh", size.height), pn.style.width = size.width + "px", pn.style.height = "100%", pn.style.marginLeft = "-" + size.width / 2 + "px"
        }, getNext: function (nowIndex, dir) {
            var pans = this.get("pannels");
            switch (dir) {
                case"up":
                    return pans[nowIndex - 1];
                case"down":
                    return pans[nowIndex + 1]
            }
        }, bindEvent: function () {
            var _this = this, page = _this.get("pageNode"), dragger = _this.get("dragger"), count = (_this.get("pannels"), _this.get("count")), vw = _this.get("vw"), ofs = {}, start = {
                x: 0,
                y: 0
            }, end = {x: 0, y: 0}, dis = 0, touchStart = function (ev) {
                //console.log('touchStart',_this.get("prevent"));
                if (_this.get("prevent"))return !1;
                var evo = ev.touches ? ev.touches[0] : ev;
                ofs = _this.get("offset"), start = {x: evo.clientX, y: evo.clientY}, dis = 0;
                var touchMove = function (ev) {
                    //console.log('move');
                    ev.preventDefault(), evo = ev.touches ? ev.touches[0] : ev, end = {
                        x: evo.clientX,
                        y: evo.clientY
                    }, dis = end.x - start.x
                }, touchEnd = function () {
                    //console.log('touchEnd',Math.abs(dis));
                    if (Math.abs(dis) <= 20)return page.removeEventListener(EVENTS.touchmove, touchMove, !1), page.removeEventListener(EVENTS.touchup, touchEnd, !1), !1;
                    var current = page.querySelector(".current"), index = +current.getAttribute("data-index"), next = _this.getNext(index, dis > 0 ? "up" : "down");
                    if (Utils.addClass(dragger, "has-transition"), next)if (Math.abs(dis) > 50) {
                        var nextTop = +next.getAttribute("data-index");
                        (page.querySelector(".last-animate")) && (Utils.removeClass(page.querySelector(".last-animate"),"last-animate"))
                        Utils.addClass(current, "last-animate");
                        console.log('111',current)
                        /*dragger.style[_this.get("transform")] = "translate3d(" + -(nextTop / count * 100) + "%, 0, 0)", */ Utils.removeClass(current, "current"), Utils.addClass(next, "current"),_this.get("pageNode").className = "page ani-"+nextTop/*Utils.addClass(_this.get("pageNode"),'ani-'+nextTop)*//*, _this.set("offset", {
                            left: nextTop,
                            top: 0
                        })*/, _this.preload(+next.getAttribute("data-index")), setTimeout(function () {
                            _this.set("prevent", !1), _this.get("transEnd").call(_this)
                        }, 300),(index == 8) && (Utils.removeClass(current,"ani-8-change-hand"),Utils.removeClass(current,"ani-8-change-hand-2")),(nextTop == 8) && (setTimeout(function(){Utils.addClass(next, "ani-8-change-hand")},1200),setTimeout(function(){Utils.addClass(next, "ani-8-change-hand-2")},1400))
                    } else return false;/*dragger.style[_this.get("transform")] = "translate3d(" + -(index / count * 100) + "%, 0, 0)"*/;
                    setTimeout(function () {
                        _this.set("prevent", !1), Utils.removeClass(dragger, "has-transition")
                    }, 300), page.removeEventListener(EVENTS.touchmove, touchMove, !1), page.removeEventListener(EVENTS.touchup, touchEnd, !1)
                };
                page.addEventListener(EVENTS.touchmove, touchMove, !1), page.addEventListener(EVENTS.touchup, touchEnd, !1)
            };
            //console.log('bind',page);
            page.addEventListener(EVENTS.touchdown, touchStart, !1), page.addEventListener(EVENTS.touchmove, function (ev) {
                ev.preventDefault()
            }, !1)
        }
    }, App.Opa = App.Opa || Opa
}(window);