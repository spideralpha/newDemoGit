//分享模块
var Share = function () {
    var _this = this;

    _this.config = {
        title: $api.getStorage('share').title,
        des: $api.getStorage('share').content,
        img: 'widget://image/share_logo.png',
        url: share_url + '?yq=' + $api.getStorage('share_code')
    }
    //分享至vx
    _this.shareWX = function (type, data) {
        var title = _this.config.title;
        if (data && data.title) {
            title = data.title;
        }
        var weiXin = api.require('wxPlus');
        weiXin.shareWebpage({
            scene: type,
            title: title,
            description: _this.config.des,
            thumb: _this.config.img,
            contentUrl: _this.config.url,
        }, function (ret, err) {
            api.hideProgress();
            if (ret.status) {
                _ajax('home/User/sharenum', function (rets, errs) {
                    api.closeFrame();
                }, {
                    user_id: $api.getStorage('userid'),
                })
            } else {
                api.toast({
                    msg: '分享失败'
                });
            }
        });
    }

    //分享至qq
    _this.shareQQ = function (type, data) {
        var title = _this.config.title;
        if (data && data.title) {
            title = data.title;
        }
        var qq = api.require('QQPlus');
        qq.shareNews({
            url: _this.config.url,
            title: title,
            description: _this.config.des,
            type: type,
            imgUrl: imgurl + 'logo.png', // Android平台只支持网络图片
        }, function (ret) {
            if (ret.status) {
                _ajax('home/User/sharenum', function (rets, errs) {
                    api.closeFrame();
                }, {
                    user_id: $api.getStorage('userid'),
                })
            } else {
                api.toast({
                    msg: '分享失败'
                });
            }
        });
    }
}
