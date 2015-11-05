$(function(){
    (function($,w){

        w.jshop.module.saleFollow = w.jshop.module.saleFollow || {};
        var popStr = '<div class="pop_cnt" style="display:none">'
            +'<div id="followTopicSuccessDiv">'
            +	'<div id="att-mod-success">'
            +		'<div class="att-img fl">'
            +			'<img src="http://misc.360buyimg.com/201007/skin/df/i/icon_correct.jpg" alt=""/>'
            +		'</div>'
            +		'<div class="att-content">'
            +			'<h2>关注成功</h2>'
            +			'<p><em id="followedNum" ></em>'
            +			'<a target="_blank" href="http://t.jd.com/activity/followActivityList.action">查看我的关注 >></a> </p>'
            +		'</div>'
            +		'<div class="att-tag-btn">'
            +			'<a class="att-btn-cancal" href="javascript:;" onclick="jdThickBoxclose()">关闭</a>'
            +		'</div>'
            +	'</div>'
            +'</div>'
            +'<div id="followTopicFailDiv" >'
            +	'<div id="att-mod-again">'
            +		'<div class="att-img fl">'
            +			'<img src="http://misc.360buyimg.com/201007/skin/df/i/icon_sigh.jpg" alt=""/>'
            +		'</div>'
            +		'<div class="att-content">'
            +			'<h2>关注失败</h2>'
            +			'<p><a target="_blank" href="http://t.jd.com/activity/followActivityList.action">查看我的关注 >></a> </p>'
            +		'</div>'
            +		'<div class="att-tag-btn">'
            +			'<a class="att-btn-cancal" href="javascript:jdThickBoxclose()">取消</a>'
            +		'</div>'
            +	'</div>'
            +'</div>'
            +'<div id="followTopicMaxDiv" >'
            +	'<div id="att-mod-again">'
            +		'<div class="att-img fl">'
            +			'<img src="http://misc.360buyimg.com/201007/skin/df/i/icon_sigh.jpg" alt=""/>'
            +		'</div>'
            +		'<div class="att-content">'
            +			'<h2>关注数量达到最大限制</h2>'
            +			'<p><a target="_blank" href="http://t.jd.com/activity/followActivityList.action">查看我的关注 >></a></p>'
            +		'</div>'
            +		'<div class="att-tag-btn">'
            +			'<a class="att-btn-cancal" href="javascript:jdThickBoxclose()">关闭</a>'
            +		'</div>'
            +	'</div>'
            +'</div>'
            +'<div id="followedTopicDiv">'
            +	'<div id="att-mod-again">'
            +		'<div class="att-img fl">'
            +			'<img src="http://misc.360buyimg.com/201007/skin/df/i/icon_sigh.jpg" alt=""/>'
            +		'</div>'
            +		'<div class="att-content">'
            +			'<h2>已关注过该活动</h2>'
            +			'<p><em id="followedNum"></em><a target="_blank" href="http://t.jd.com/activity/followActivityList.action">查看我的关注 >></a> </p>'
            +		'</div>'
            +		'<div class="att-tag-btn">'
            +			'<a class="att-btn-cancal" href="javascript:jdThickBoxclose()">关闭</a>'
            +		'</div>'
            +	'</div>'
            +'</div>'
            +'</div>';
        if(!$('.jPageExtra').length)
            $('body').append($('<div class="jPageExtra">' + popStr + '</div>'));

        $.extend(w.jshop.module.saleFollow, {
            base : function(arg){
                var _this = this,
                    _args = $.extend({
                        item : 'li',
                        follow : '.J-attention',
                        favorite : '.J-addFavorite'
                    },arg || {}),
                    _url = 'http://follow.soa.jd.com/activity/follow?activityId=',
                    _follow_con = $('.jPageExtra .pop_cnt');

                function _init(){
                    $(_this).find(_args.item).each(function(index,n){
                        var __id = $(n).attr('id'),
                            __address = $(n).attr('address'),
                            __title = $(n).attr('title'),
                            __type = $(n).attr('srcType');
                        if(!__id || !__address || !__title) return;
                        $(n).find(_args.follow).click(function(){
                            function __follow(){
                                $.ajax({
                                    url : _url + __id + '&srcType=' + __type,
                                    dataType : 'jsonp',
                                    async : false,
                                    success : function(data){
                                        _followSuccess(data);
                                    },
                                    error : function(){
                                        _followFail('followTopicFailDiv');
                                    }
                                });
                            }
                            thick_login(__follow);
                        });

                        $(n).find(_args.favorite).click(function(){
                            try{
                                if (document.all) {
                                    window.external.AddFavorite(__address, __title);
                                } else if (window.sidebar) {
                                    window.sidebar.addPanel(__title, __address, "");
                                } else {
                                    alert('对不起，您的浏览器不支持此操作!\n请您使用菜单栏或Ctrl+D收藏，收藏地址为' + __address + '。');
                                }
                            }
                            catch(e){
                                alert('对不起，您的浏览器不支持此操作!\n请您使用菜单栏或Ctrl+D收藏，收藏地址为' + __address + '。');
                            }
                        });
                    });
                }

                function _followSuccess(data){
                    //FIXME
                    if( data.code == 'F10000' ){//F10000 成功
                        _followed("followTopicSuccessDiv");
                        $mod_sales_follow.addClass('has-followed');
                        return;
                    }

                    if( data.code == 'F0402' ){//F0409 已关注过，不能加关注
                        _followed("followedTopicDiv");
                        return;
                    }
                    if(data.code == 'F0410'){
                        _followFail("followTopicMaxDiv");
                        return;
                    }
                    //弹出错误页面
                    _followFail("followTopicFailDiv");
                }

                function _followFail(divElem){
                    jQuery.jdThickBox({
                        width: 300,
                        height: 80,
                        title: '关注失败',
                        source: _follow_con.find('#'+divElem).html()
                    });
                    return;
                }

                function _getFollowNum(url,followNumSuccessCallBack){
                    jQuery.ajax({
                        async: false,//同步调用
                        url:url,
                        dataType:"jsonp",
                        success:function(data){
                            followNumSuccessCallBack(data);

                        },
                        error: function(reques,msg){
                            //弹出关注失败；
                            _followShopFail();

                        }
                    });
                };

                function _followed(divElem){
                    //获取关注数量
                    var title;
                    var url;

                    title="提示";
                    url = "http://follow.soa.jd.com/activity/queryForCount";
                    _getFollowNum(url,function(data){
                        var followedNum="您已关注"+data.data+"个活动\， ";
                        _follow_con.find('#followedNum').html(followedNum);

                        jQuery.jdThickBox({
                            width: 300,
                            height: 80,
                            title: title,
                            source: _follow_con.find('#'+divElem).html()
                        });
                    });
                }

                _init();
            }

        });

    })(jQuery,window);
    jshop.module.saleFollow.base.call($mod_sales_follow);
})
