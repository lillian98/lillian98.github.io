var settings = $.ajaxSettings;
settings.type = "get";
settings.charset = "utf8";
settings.dataType = "jsonp";
settings.timeout = 1000 * 10;

function request(options) {
    var success = options.success;
    var error = options.error;
    options.data = "body=" + JSON.stringify(options.data);
    options.success = function(data, status, xhr) {
        if (data.code == "0") {
            success && success(data, status, xhr);
        } else if (data.code == "3") {
            var url = getUrlRoot();
            location.href = "https://passport.m.jd.com/user/login.action?v=1&returnurl=" + encodeURIComponent(url);
        } else {
            alert('网络跑累了，请稍候再来！');
        }
    };
    options.error = error || function() {
        alert("网络飞到外太空")
    };

    return $.ajax(options);
}

function getUrlRoot() {
    if (location.pathname.indexOf(".html") < 0) return "";
    return location.href.match(/^(.+?\.html)/)[1];
};

/*
接口返回码：
    code  
        0 : 后台处理成功
        3 : 用户未登录
        其他 ：后台处理失败
    subCode
        0 : 后台处理成功
        其他 ：需与后台沟通定义返回码代表含义
*/
