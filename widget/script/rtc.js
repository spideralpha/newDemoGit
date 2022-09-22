var RTC = function(scene) {
    var _this = this;
    var trtc = api.require('tencentTRTC');
    _this.sdkAppId = $api.getStorage('rtcid'); // 腾讯rtc appid
    _this.scene = !scene ? 0 : 1; // 应用场景  0: 视频通话 1: 视频直播 2: 语音通话 3: 语音直播

    // 进入房间 TRTC 同一时间不支持两个相同的 userId 进入房间，否则会相互干扰。
    _this.enterRoom = function(data, callback) {
        console.log('进入房间')
        trtc.enterRoom({
            appId: _this.sdkAppId,
            userId: data.uid,
            roomId: data.room, // 取值范围: [1 - 4294967294]
            userSig: data.sign,
            // privateMapKey: data.privateMapKey // 房间签名
            scene: 0 //  应用场景 0: 视频通话 1: 视频直播 2: 语音通话 3: 语音直播
        });
    }
    // 离开房间
    _this.exitRoom = function() {
        trtc.exitRoom();
    }

    // 开始拉取并显示指定用户的远端画面
    _this.startRemoteView = function(touid) {
        console.log('开启远端画面')
        trtc.startRemoteView({
            rect: {
                x: 0,
                y: 0,
                w: api.winWidth,
                h: api.winHeight
            },
            remoteUid: touid,
            // fixedOn: api.frameNme,
            fixed: true,
        });
    }

    // 开启摄像头预览
    _this.startLocalPreview = function(type) {
        console.log('开启摄像头预览')
        var obj1 = {
            x: api.winWidth / 4 * 3,
            y: 0,
            w: api.winWidth / 4,
            h: api.winHeight / 4
        };
        var obj2 = {
            x: 0,
            y: 0,
            w: api.winWidth,
            h: api.winHeight
        }
        var obj = !type ? obj1 : obj2;
        console.log(JSON.stringify(obj));
        trtc.startLocalPreview({
            rect: obj,
            isFrontCamera: true,
            // fixedOn: api.frameName,
            // fixed: true
        });
    }

    // 设置监听
    _this.setTrtcListener = function(callback) {
        trtc.setTRTCListener({}, function(ret, err) {
            /* 
            ‘error’:错误回调
            ‘warning’：警告事件
            ‘enterRoom’：进入房间
            ‘exitRoom’：退出房间
            ‘remoteUserEnterRoom’:有用户加入当前房间
            ‘remoteUserLeaveRoom’:由用户离开当前房间
            ‘firstVideoFrame’:开始渲染本地或远程用户的首帧画面               
            'firstAudioFrame':开始播放远程用户的首帧音频（本地声音暂不通知）
            'sendFirstLocalVideoFrame':首帧本地视频数据已经被送出
            ‘sendFirstLocalAudioFrame’:首帧本地音频数据已经被送出
            ‘connectionLost’:与服务器连接断开
            ‘tryToReconnect’:尝试重新连接到服务器
            ‘connectionRecovery’:与服务器连接恢复
            ‘screenCaptureStarted’:屏幕分享开始
            ‘screenCapturePaused’:屏幕分享暂停
            ‘screenCaptureResumed‘：屏幕分享恢复
            ’screenCaptureStoped‘：屏幕分享停止
            ’userVideoAvailable‘：远端用户是否存在可播放的主路画面（一般用于摄像头）
            ’userAudioAvailable‘：远端用户是否存在可播放的音频数据
            */
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
            if (typeof callback == 'function') {
                callback(ret);
            }
        });
    }
    // 开启本地音频的采集和上行
    _this.startLocalAudio = function() {
        trtc.startLocalAudio();
    }


    _this.meiyan = function(data) {
        if (!data) {
            _this.setBeautyStyle(1);
            _this.setBeautyLevel(8);
            _this.setWhitenessLevel(8);
            _this.setRuddyLevel(8);
        } else {
            if (data.mp) {
                _this.setBeautyLevel(data.mp);
            }
            if (data.mb) {
                _this.setBeautyLevel(data.mb);
            }
            if (data.hr) {
                _this.setBeautyLevel(data.hr);
            }
            if (data.lj) {
                _this.setBeautyLevel(data.lj);
            }
            if (data.img) {
                _this.setFilter(data.img);
            }
        }
    }

    // 设置美颜（磨皮）算法 
    _this.setBeautyStyle = function(mode) {
        // 0: 光滑，适用于美女秀场，效果比较明显
        // 1: 自然，磨皮算法更多地保留了面部细节，主观感受上会更加自然
        // 2: 朦胧(仅支持iOS)
        trtc.setBeautyStyle({
            style: mode
        }, function(ret, err) {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
        });
    }
    // 设置美颜级别 0表示关闭，1 - 9值越大，效果越明显。
    _this.setBeautyLevel = function(level) {
        trtc.setBeautyLevel({
            beautyLevel: level
        }, function(ret, err) {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
        });
    }
    // 设置美白级别 0表示关闭，1 - 9值越大，效果越明显。
    _this.setWhitenessLevel = function(level) {
        trtc.setWhitenessLevel({
            whitenessLevel: level
        }, function(ret, err) {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
        });
    }
    // 设置红润级别 0表示关闭，1 - 9值越大，效果越明显。
    _this.setRuddyLevel = function(level) {
        trtc.setRuddyLevel({
            ruddyLevel: level
        }, function(ret, err) {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
        });
    }
    // 设置指定素材滤镜特效
    _this.setFilter = function(img) {
        trtc.setFilter({
            path: img // 即颜色查找表图片。必须使用 png 格式
        }, function(ret, err) {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
        });
    }
    // 设置滤镜浓度 取值范围: [0 - 1] 默认值: 0.5
    _this.setFilterStrength = function(strength) {
        strength = strength / 10;
        trtc.setFilterStrength({
            strength: strength
        }, function(ret, err) {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
        });
    }

    // 切换摄像头
    _this.switchCamera = function(isFront) {
        trtc.switchCamera({
            // isFront: isFront
        }, function(ret, err) {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
        });
    }

    /* 音乐 */
    _this.bgm = function(path, cb) {
        trtc.playBGM({
            path: path // 支持的文件格式：aac, mp3，android支持fs路径，iOS支持widget、fs路径
        }, function(ret, err) {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
            if (typeof cb == 'function') {
                cb(ret)
            }
        });
    }
    _this.stopBGM = function() {
        trtc.stopBGM();
    }
    _this.pauseBGM = function() {
        trtc.pauseBGM();
    }
    _this.resumeBGM = function() {
        trtc.resumeBGM();
    }
    _this.setBGM = function(data) {
        if (data.p) {
            // 设置进度
            trtc.setBGMPosition({
                pos: data.p, // 毫秒
            });
        }
        if (data.v) {
            // 设置音量
            trtc.setBGMVolume({
                volume: data.v, // [0-100]
            });
        }
        if (data.localV) {
            // 本地
            trtc.setBGMPlayoutVolume({
                volume: data.localV, // [0-100]
            });
        }
        if (data.remoteV) {
            // 远端
            trtc.setBGMPublishVolume({
                volume: data.remoteV, // [0-100]
            });
        }
    }

    // 变声
    _this.voice = function(type, cb) {
        // 1：熊孩子 2：萝莉 3：大叔 4：重金属 5：感冒 6：外国人 7：困兽 8：死肥宅 9：强电流 10：重机械 11：空灵
        trtc.setVoiceChangerType({
            type: type,
        }, function(ret, err) {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
            if (typeof cb == 'function') {
                cb(ret)
            }
        });
    }
    // 设置音频路由 0:扬声器、1:听筒
    _this.oncall = function(route) {
        trtc.setAudioRoute({
            route: 0
        });
    }
}