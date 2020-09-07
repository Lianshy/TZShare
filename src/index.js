/*
 * @Descripttion: Wechat sharing for internal use only
 * @version: v0.0.1
 * @Author: -Lianshy
 * @Date: 2020-09-02 15:20:59
 * @LastEditors: -Lianshy
 * @LastEditTime: 2020-09-02 17:12:21
 */
;
(function (win, doc) {
    const SDK_URL = 'https://res.wx.qq.com/open/js/jweixin-1.4.0.js'
    const TZ_URL = 'https://www.tanzi188.com/Weixin/WeixinJsSdk/getYouCdSign.html'
    const defaultOptions = {
        link: "分享链接",
        imgUrl: "分享图标",
        title: '分享标题',
        desc: "分享描述",
        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone']
    }
    class TZShare {
        constructor(options) {
            this.options = {
                ...defaultOptions,
                ...options
            }
            this._loadSDK(() => {
                this._init()
            })
        }
        _loadSDK(callback) {
            let script = doc.createElement('script');
            script.type = "text/javascript";
            if (typeof (callback) != "undefined") {
                if (script.readyState) {
                    script.onreadystatechange = function () {
                        if (script.readyState == "loaded" || script.readyState == "complete") {
                            script.onreadystatechange = null;
                            callback();
                        }
                    }
                } else {
                    script.onload = function () {
                        callback();
                    }
                }
            }
            script.src = SDK_URL;
            document.head.appendChild(script);
        }
        _init() {
            let {
                jsApiList,
                link,
                imgUrl,
                title,
                desc
            } = this.options,
                _shareData = {
                    link,
                    imgUrl,
                    title,
                    desc
                },
                httpRequest = new XMLHttpRequest();
            httpRequest.open('GET', TZ_URL, true);
            httpRequest.send();
            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    let data = JSON.parse(httpRequest.responseText)
                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: jsApiList
                    });
                }
            };
            wx.ready(() => {
                wx.onMenuShareTimeline(_shareData);
                wx.onMenuShareAppMessage(_shareData);
                wx.onMenuShareQQ(_shareData);
            })
        }
    }
    win.TZShare = TZShare
})(window, document);
