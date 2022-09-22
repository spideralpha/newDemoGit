// 课程id
var videoPlay = function (id) {
    var videoPlayer = api.require('videoPlayer');
    var _this = this;
    // 初始化
    var init = function () {
        // 监听android返回
        api.addEventListener({
            name: 'keyback'
        }, function (ret) {
            api.closeWin();
        })

        //应用进入后台
        api.addEventListener({
            name: 'pause'
        }, function (ret, err) {
            videoPlayer.pause(); //暂停播放
        });
        //应用进入前台
        api.addEventListener({
            name: 'resume'
        }, function (ret, err) {
            videoPlayer.start(); //开始播放
        });
    }
    init();

    // 打开
    _this.play = function (data) {
        var headerTop = $api.offset($api.dom('header')).h;
        videoPlayer.open({
            rect: {
                x: 0,
                y: headerTop,
                w: api.winWidth,
                h: api.winHeight - headerTop
            },
            bg: '#000',
            path: data.url,
            autoPlay: false,
            loop: false,
            seekBarDragable: false
        }, function (ret, err) {
            _loadingClose();
            console.log(JSON.stringify(ret))
            console.log(JSON.stringify(err))
            // _this.volume();
            videoPlayer.start();
        });
    }

    // 设置音量
    _this.volume = function(){
        videoPlayer.setVolume({
            volume: 0.6
        });
    }

    // 关闭
    _this.stop = function () {
        videoPlayer.stop();
    }

}