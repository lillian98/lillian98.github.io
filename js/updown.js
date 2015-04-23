/* 上下滑动 */
!function (window) {
    function Opa(cfg) {
        var config, util = App.Utils;
        this.config = util.merge({}, _default, cfg || {}), config = util.clone(this.config), this.get = function (key) {
            return config[key]
        }, this.set = function (key, val) {
            config[key] = val
        }, this.init()
    }

    window.App = window.App || {};
    var _default = {page: "J_opaPage", pannel: "J_opaPannel"}, body = document.documentElement || document.body, EVENTS = {touchdown: "ontouchstart"in window ? "touchstart" : "mousedown", touchmove: "ontouchmove"in window ? "touchmove" : "mousemove", touchup: "ontouchend"in window ? "touchend" : "mouseup"}, userAgent = navigator.userAgent.toLowerCase(), browser = {version: userAgent.match(/(?:firefox|opera|safari|chrome|msie|applewebkit)[\/: ]([\d.]+)/)[1], safari: /version.+safari/.test(userAgent), chrome: /chrome/.test(userAgent), firefox: /firefox/.test(userAgent), ie: /msie/.test(userAgent), opera: /opera/.test(userAgent), webkit: /webkit/gi.test(userAgent)};
    Opa.prototype = {init: function () {
        var len = 0;
        this.set("pageNode", document.getElementById(this.get("page")) || document.body), this.set("panNodes", this.get("pageNode").querySelectorAll("." + this.get("pannel"))), len = this.get("panNodes").length, !len || 2 > len || (this.set("vw", body.clientWidth > 750 ? 750 : body.clientWidth), this.set("vh", this.get("size").height || body.clientHeight), this.set("pb", document.querySelector("#J_PageBack")), this.set("current", 0), this.set("circle", !1), this.set("diff", 100), this.set("prefix", this.getPrefix(browser)), this.set("prevent", !1), this._parseNode(), this.preLoad(0), this.bindEvent(), this.pbEvent())
    }, getPrefix: function (brow) {
        var pre = "";
        return pre = browser.webkit ? "Webkit" : brow.firefox ? "Moz" : brow.msie ? "Ms" : brow.opera ? "O" : ""
    }, _parseNode: function () {
        var pn = this.get("pageNode"), pans = this.get("panNodes"), util = App.Utils;
        pn.style.width = this.get("vw") + "px", pn.style.height = this.get("vh") + "px", pn.style.left = "50%", pn.style.marginLeft = "-" + this.get("vw") / 2 + "px", pn.style.overflow = "hidden";
        for (var i = 0, len = pans.length; len > i; i++) {
            var item = pans.item(i);
            item.style.position = "absolute", item.style.left = "0", item.style.top = "0", item.style.width = "100%", item.style.height = "100%", 0 !== i ? (item.style[this.get("prefix") + "Transform"] = "translate3d(0, " + this.get("vh") + "px, 0)", item.style.transform = "translate3d(0, " + this.get("vh") + "px, 0)") : (util.addClass(item, "current"), util.addClass(item, "start-animate")), item.setAttribute("data-index", i)
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
                posObj = ev.touches ? ev.touches[0] : ev, move.y = posObj.clientY || posObj.pageY, disy = move.y - start.y, Math.abs(disy) > 20 && (disy > 0 ? target.getAttribute("data-index") > 0 ? (next = _this.getNext.call(_this, index, -1), scale = (1 - Math.abs(disy / vh)).toFixed(2), target.style[pre + "TransformOrigin"] = "center bottom", target.style.transformOrigin = "center bottom", target.style[pre + "Transform"] = "scale(" + scale + ")", target.style.transform = "scale(" + scale + ")", next.style[pre + "Transform"] = "translate3d(0, -" + (vh - disy) + "px, 0)", next.style.transform = "translate3d(0, -" + (vh - disy) + "px, 0)") : (next = null, target.style[pre + "Transform"] = "translate3d(0, " + disy + "px, 0)", target.style.transform = "translate3d(0, " + disy + "px, 0)") : target.getAttribute("data-index") < len - 1 ? (next = _this.getNext.call(_this, index, 1), scale = (1 - Math.abs(disy / vh)).toFixed(2), target.style[pre + "TransformOrigin"] = "center top", target.style.transformOrigin = "center top", target.style[pre + "Transform"] = "scale(" + scale + ")", target.style.transform = "scale(" + scale + ")", next.style[pre + "Transform"] = "translate3d(0, " + (vh + disy) + "px, 0)", next.style.transform = "translate3d(0, " + (vh + disy) + "px, 0)") : next = null), ev.preventDefault()
            }

            function endHandler(ev) {
                next ? (posObj = ev.changedTouches ? ev.changedTouches[0] : ev, move.y = posObj.clientY || posObj.pageY, disy = move.y - start.y, next = disy > 0 ? _this.getNext.call(_this, index, -1) : _this.getNext.call(_this, index, 1), util.addClass(target, "has-transition"), util.addClass(next, "has-transition"), Math.abs(disy) > _this.get("diff") ? (target.style[pre + "Transform"] = "scale(0)", target.style.transform = "scale(0)", next.style[pre + "Transform"] = "translate3d(0, 0, 0)", next.style.transform = "translate3d(0, 0, 0)", setTimeout(function () {
                    util.removeClass(target, "current"), util.addClass(next, "current"), util.removeClass(target, "has-transition"), util.removeClass(next, "has-transition"), _this.preLoad(next.getAttribute("data-index")), _this.set("prevent", !1), _this.get("transEnd") && _this.get("transEnd").call(_this)
                }, 300)) : (target.style[pre + "Transform"] = "scale(1)", target.style.transform = "scale(1)", next.style[pre + "Transform"] = "translate3d(0, " + (disy > 0 ? -1 : 1) * vh + "px, 0)", next.style.transform = "translate3d(0, " + (disy > 0 ? -1 : 1) * vh + "px, 0)", setTimeout(function () {
                    _this.set("prevent", !1), util.removeClass(target, "has-transition"), util.removeClass(next, "has-transition")
                }, 300))) : (util.addClass(target, "has-transition"), target.style[pre + "Transform"] = "translate3d(0, 0, 0)", target.style.transform = "translate3d(0, 0, 0)", target.getAttribute("data-index") == len - 1 && _this.get("pb") && (_this.get("pbTimer") && (clearTimeout(_this.get("pbTimer")), _this.pbTimer = null), _this.get("pb").style.visibility = "visible", _this.get("pb").style.zIndex = 100, _this.get("pb").style.opacity = 1), setTimeout(function () {
                    _this.set("prevent", !1), util.removeClass(target, "has-transition")
                }, 300)), page.removeEventListener(EVENTS.touchmove, moveHandler, !1), page.removeEventListener(EVENTS.touchup, endHandler, !1)
            }

            if (_this.get("prevent"))return!1;
            _this.set("prevent", !0);
            var target = page.querySelector(".current"), index = +target.getAttribute("data-index"), next = (_this.get("circle"), null), disy = 0, scale = 0, vh = _this.get("vh"), posObj = ev.touches ? ev.touches[0] : ev;
            start.y = posObj.clientY || posObj.pageY, page.addEventListener(EVENTS.touchmove, moveHandler, !1), page.addEventListener(EVENTS.touchup, endHandler, !1)
        }

        var _this = this, util = App.Utils, pre = (_this.get("current"), _this.get("prefix")), page = _this.get("pageNode"), start = {x: 0, y: 0}, move = {x: 0, y: 0}, pans = _this.get("panNodes"), len = pans.length;
        page.addEventListener(EVENTS.touchdown, exchange, !1), page.addEventListener(EVENTS.touchmove, function (ev) {
            ev.preventDefault()
        }, !1)
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
    }}, App.Opa = App.Opa || Opa
}(window);