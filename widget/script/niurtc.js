var RTC = function () {
    var _this = this;
    var qiniuRTC = api.require('qiniuRTC');

    // 初始化   
    _this.init = function () {
        qiniuRTC.init(function (ret) {
            console.log(JSON.stringify(ret));

        });
    }

    // 渲染窗口 uid: 远端的uid  | type:0大窗口，1小窗口 | local 1表示本地
    // 渲染远端窗口时需要在订阅事件（即addSubscribeListener）中操作
    _this.open = function (callback, data) {
        var uid = '';
        if (data && data.uid) {
            uid = data.uid;
        }
        // 右上角自己窗口
        var obj1 = {
            x: api.winWidth / 3 * 2,
            y: 0,
            w: api.winWidth / 3,
            h: api.winHeight / 3
        };
        // 全屏窗口
        var obj2 = {
            x: 0,
            y: 0,
            w: api.winWidth,
            h: api.winHeight
        }
        var rect = obj2;
        if (data && data.type) {
            var rect = obj1;
        }
        qiniuRTC.renderVideoFrame({
            rect: rect,
            userId: uid,
            // fillMode: 'ratio',
            // fixedOn: api.frameName,
            // fixed: true,
            // videoWidth: '', // 采集视频的宽度
            // videoHeight: '', // 采集视频的高度
            // frameRate: '', // 视频帧率
        }, function (ret) {
            console.log(JSON.stringify(ret));
            if (ret.status) {
                // 开启摄像头采集 打开本地预览时，开启采集才会显示。
                if (data && data.local == 1) {
                    qiniuRTC.startCapture();
                }
                if (typeof callback == 'function') {
                    callback();
                }
            }
        });
    }


    // 关闭窗口 要显示的视频窗口的userID，若不传或传空则表示本地预览视频窗口
    _this.close = function (uid) {
        qiniuRTC.closeVideoFrame({
            userId: uid
        });
    }

    // 停止视频采集
    _this.stop = function () {
        qiniuRTC.stopCapture();
    }

    // 切换摄像头
    _this.change = function () {
        qiniuRTC.toggleCamera();
    }


    // 发布本地的音视频到服务器。
    _this.publish = function () {
        qiniuRTC.publish();
    }

    // 是否静音远端的声音
    _this.quiet = function () {
        qiniuRTC.setMuteSpeaker({
            mute: false
        });
    }
    // 是否静音本地的声音
    _this.quietLocal = function () {
        qiniuRTC.muteAudio({
            mute: false
        });
    }

    // 加入房间
    _this.join = function (token, callback) {
        qiniuRTC.joinRoom({
            token: token,
            // userData: 'hello'
        });
        callback();

    }

    // 离开
    _this.leave = function () {
        qiniuRTC.leaveRoom(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }

    // 远端用户视频首帧解码后的回调
    _this.listenOtherVideo = function () {
        qiniuRTC.addRemoteUserVideoListener(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }
    // 远端用户加入房间的监听
    _this.listenOtherJoin = function () {
        qiniuRTC.addDidJoinListener(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }
    // 房间状态监听
    _this.listenRoomState = function () {
        qiniuRTC.addRoomStateListener(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }
    // 有人离开房间的监听
    _this.listenRoomLeave = function () {
        qiniuRTC.addDidLeaveListener(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }
    // 订阅事件 android
    _this.anListen = function () {
        qiniuRTC.addSubscribeListener(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }
    // 推流相关事件 android
    _this.anListenTui = function () {
        qiniuRTC.addEventListener(function (ret) {
            // LocalPublished 本地发布
            // RemotePublished 远程发布， userId 不为空
            // RemoteUnpublished 远程取消发布， userId 不为空
            // RemoteUserMuted 远程用户静音， userId 不为空
            // RoomLeft 离开房间
            console.log(JSON.stringify(ret));
        });
    }

    // 销毁RTC实例 android
    _this.anRemove = function () {
        qiniuRTC.destory();
    }


    // 设置美颜
    _this.meiyan = function (data) {
        qiniuRTC.setBeautify({
            beautify: data.open, // 美颜是否开启 若为false，后面三个参数无效
            setBeautify: data.my || 0, // 设置美颜程度 0 ~ 1
            setWhiten: data.mb || 0, // 设置美白程度
            setRedden: data.hr || 0 // 设置红润程度
        })
    }

    // 初始化美颜功能
    _this.initBeauty = function () {
        qiniuRTC.initEffect({
            modelFileDirPath: "widget://res/ModelResource.bundle",
            licenseFilePath: "widget://res/LicenseBag.bundle",
            // @ "qiniu_20200214_20210213_com.qbox.QNRTCKitDemo.bytedance_qiniu_v3.4.2.licbag",
            resPath: '',
        });
    }

    // 获取滤镜和贴纸 IOS
    _this.iosFilter = function () {
        qiniuRTC.getStickers({
            type: 'filter' // sticker：贴纸 filter：滤镜
        }, function (ret) {
            console.log(JSON.stringify(ret));
        });
    }


    // 设置贴纸
    _this.setTiezhi = function (name) {
        qiniuRTC.setSticker({
            displayName: name // 贴纸效果名称，若不传则表示去掉已设置的贴纸
        });
    }
    // 设置滤镜
    _this.setFilter = function (name) {
        qiniuRTC.setFillterr({
            displayName: name // 滤镜效果名称，若不传则表示去掉已设置的滤镜
        });
    }

    // 获取美颜、美型、美体、口红、腮红、修容、美瞳、染发、眼影、眉毛 IOS
    _this.iosGetEffect = function (type) {
        // beauty： 美颜
        // reshape： 美型
        // body： 美体
        // lip： 口红
        // blush： 晒红
        // facial： 修容
        // pupil： 美瞳
        // hair： 染发
        // eyeshadow： 眼影
        // eyebrow： 眉毛

        qiniuRTC.getMakeUp({
            type: type
        }, function (ret) {
            console.log(JSON.stringify(ret));
        });
    }

    // 设置多个效果 iOS 
    _this.iosSetEffect = function (type) {
        // beauty： 美颜
        // reshape： 美型
        // body： 美体
        // lip： 口红
        // blush： 晒红
        // facial： 修容
        // pupil： 美瞳
        // hair： 染发
        // eyeshadow： 眼影
        // eyebrow： 眉毛
        qiniuRTC.updateMakeups({
            type: type,
            makeups: ['蜜桃', '微醺', '甜橙'] // 效果名称组成的数组，如['蜜桃','微醺','甜橙']，若不传则表示去掉已设置的
        });
    }

    // 更新美颜美妆及其强度 iOS 系统
    _this.iosUpdateEffect = function (data, callback) {
        // beauty： 美颜
        // reshape： 美型
        // body： 美体
        // lip： 口红
        // blush： 晒红
        // facial： 修容
        // pupil： 美瞳
        // hair： 染发
        // eyeshadow： 眼影
        // eyebrow： 眉毛
        qiniuRTC.updateMakeupIntensity({
            type: data.type,
            intensity: data.num,
            displayName: data.name
        });
    }

    // 设置特效组合，目前仅支持美颜、美型两种特效的任意叠加 Android 系统
    _this.anSetEffect = function () {
        qiniuRTC.setComposeNodes({
            nodes: [] // 资源路径数组
        });
    }

    // 设置 composer 类型特效（美颜、美妆）是否可以与贴纸特效叠加 Android 系统
    _this.anAddTiezhi = function () {
        qiniuRTC.setComposerMode({
            mode: 'SHARE', //  ALONE 不可叠加 SHARE 可叠加
        });
    }

    // 更新某个特效的强度 Android 系统
    _this.anUpdateEffect = function (data) {
        qiniuRTC.setComposeNodes({
            key: data.key,
            value: data.num
        });
    }
    // 更新某个特效的强度 Android 系统
    _this.anUpdateEffect2 = function (data) {
        // filter
        // beautyWhite
        // beautySmooth
        // faceReshape
        // beautySharp
        qiniuRTC.setComposeNodes({
            type: data.type,
            intensity: data.num
        });
    }

    // 获得已经开启的特效节点
    _this.anGetOpenEffect = function () {
        qiniuRTC.getComposeNodes(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }

    // 恢复特效设置 Android 系统
    _this.anRecover = function () {
        qiniuRTC.recoverStatus();
    }

    // 释放特效资源
    _this.rmEffect = function () {
        qiniuRTC.destroyEffectSDK();
    }

    // 获取支持的滤镜列表
    _this.anGetFilter = function () {
        qiniuRTC.getFilterList(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }
    // 获取支持的贴纸列表
    _this.anGetTiezhi = function () {
        qiniuRTC.getStickerList(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }

    // 获取支持的美型列表
    _this.anGetMX = function () {
        qiniuRTC.getShapeList(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }
    // 获取支持的美妆类型列表
    _this.anGetMZ = function () {
        qiniuRTC.getMakeUpList(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }
    // 获取支持的美妆效果集合
    _this.anGetMZEffect = function () {
        qiniuRTC.getMakeUpOptionItems(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }
    // 获取支持的美体列表
    _this.anGetMT = function () {
        qiniuRTC.getBodyList(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }
    // 更新 compose 类型特效列表
    _this.anUpdate = function () {
        qiniuRTC.updateComposeList();
    }
    // 更新滤镜列表
    _this.anUpdateFilter = function () {
        qiniuRTC.updateFilterList();
    }
    // 更新贴纸列表
    _this.anUpdateTiezhi = function () {
        qiniuRTC.updateStickerList();
    }
    // 更新全部特效列表
    _this.anUpdateAll = function () {
        qiniuRTC.updateAllList();
    }
    // 判断是否正在使用特效
    _this.isUsing = function () {
        qiniuRTC.isUsingEffect(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }
    // 检测 SDK 是否已经初始化完毕
    _this.isInit = function () {
        qiniuRTC.isEffectSDKInited(function (ret) {
            console.log(JSON.stringify(ret));
        });
    }
}