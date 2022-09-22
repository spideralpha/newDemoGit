// 课程id
var videoPlay = function (id) {
    var playModule = api.require('playModule');
    var _this = this;
    // 初始化
    var init = function () {
        // playModule.init({
        //     // logo: "widget://image/logo.png", // 右上角logo
        //     // background: "widget://image/bg.png", // 视频播放前的图片显示
        //     FullScreenViewIsFont: false, //为fasle时可通过openframe自定义按钮在播放器上层
        //     loading: 'widget://gif/loading.gif', // 加载中的gif动画图片接口
        // })
        // 监听小窗返回按钮
        playModule.addEventListener({
            name: 'backBtn'
        }, function (ret, err) {
            console.log(JSON.stringify(ret))
            console.log(JSON.stringify(err))
            if (ret.status) {
                api.closeWin();
            }
        })
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
            playModule.pause(); //暂停播放
        });
        //应用进入前台
        api.addEventListener({
            name: 'resume'
        }, function (ret, err) {
            playModule.start(); //开始播放
        });
    }
    init();

    // 打开
    _this.play = function (data) {
        var headerTop = $api.offset($api.dom('header')).h;
        playModule.play({
            rect: {
                x: 0,
                y: headerTop,
                w: api.winWidth,
                h: api.winHeight - headerTop
            },
            title: '',
            url: data.url,
            isBackBtn: false, // 小窗口是否显示返回按钮
            isOpenGesture: false, // 全屏时是否开启手势控制音量，亮度和进度 （开启：true；不开启：false）
            defaultBtn: false, //	设置本次播放是否显示默认自带的播放控制按钮
            isTopView: false, //	是否显示顶部标题栏
            enableFull: false, //	本次播放视频是否全屏播放，当为true时将直接全屏播放视频，x,y,w,h,fixedOn,fixed值不会生效。
            isFullBtn: false, // 	小窗口是否显示进入全屏按钮
            isBackBtn: false, // 	小窗口是否显示返回按钮
            scalingMode: 4, // 	1:无缩放, 2:适应大小模式, 3:充满可视范围，可能会被裁剪, 4:缩放到充满视图
            fullscreenMode: 'PORTRAIT', //	设置全屏按钮控制全屏显示模式是横屏还是竖屏 竖屏:PORTRAIT ; 横屏:LANDSCAPE
            isShowProcessView: false, //	是否显示进度条 (显示:true ; 不显示:false)【备注:直播流自动默认为false】
            isShowTimeLable: false, //	是否显示播放时间 (显示:true ; 不显示:false)
            isOpenGesture: false, //	全屏时是否开启手势控制音量，亮度和进度 （开启：true；不开启：false）
            isSmallOpenGesture: false, //	窗口播放时是否开启手势控制音量，亮度和进度 （开启：true；不开启：false）
            isLoop: true,
            isLocalCache:true,
            isOpenDanmu: false
        }, function (ret, err) {
            console.log(JSON.stringify(ret))
            console.log(JSON.stringify(err))
        });
    }

    // 关闭
    _this.stop = function () {
        playModule.stop(function (ret, err) {
        });
    }

}