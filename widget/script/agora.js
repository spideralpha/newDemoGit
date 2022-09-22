var ARtc = function() {
    var agoraRtc = api.require('agoraRtc');
    var _this = this;
    // 初始化
    if (agoraRtc) {
        agoraRtc.init({
            appId: $api.getStorage('lianmai')
        });
    }

    // 离开频道 异步 需使用leaveChannelListener 监听结果
    _this.leave = function() {
        $api.setStorage('callStatus', 0); // 不在通话中
        agoraRtc.leaveChannel(function(ret) {
            console.log(JSON.stringify(ret))
            if (ret.code == 0) {
                //success
            }
        });
    }

    // 加入频道
    _this.join = function(channel, uid) {
        _this.leave();
        agoraRtc.joinChannel({
            channel: channel,
            uid: uid,
        }, function(ret) {
            console.log(JSON.stringify(ret))
            if (ret.code == 0) {
                //success
            }
        });
    }


    // 监听是否加入频道
    _this.joinSuccess = function(callback) {
        agoraRtc.joinChannelSuccessListener(function(ret) {
            console.log(JSON.stringify(ret))
            if (typeof callback == 'function') {
                callback(ret);
            }
        });
    }

    // 监听是否离开频道
    _this.leaveSuccess = function(callback) {
        agoraRtc.leaveChannelListener(function(ret) {
            console.log(JSON.stringify(ret))
            if (typeof callback == 'function') {
                callback(ret);
            }
        });
    }

    // 提示有人加入频道
    _this.otherJoin = function(callback) {
        agoraRtc.remoteUserJoinedListener(function(ret) {
            console.log(JSON.stringify(ret))
            if (typeof callback == 'function') {
                callback(ret);
            }
        });
    }

    // 提示有人离开频道
    _this.otherLeave = function(callback) {
        agoraRtc.remoteUserOfflineListener(function(ret) {
            console.log(JSON.stringify(ret))
            if (typeof callback == 'function') {
                callback(ret);
            }
        });
        // agoraRtc.remoteUserOfflineListener(function(ret) {
        //     //agoraRtc.setupRemoteVideo({uid: ret.uid});
        // });
    }

    // 监听SDK错误
    _this.error = function() {
        agoraRtc.errorListener(function(ret) {
            console.log(JSON.stringify(ret))
            // _this.leave();
        });
    }

    // 监听警告
    _this.warn = function() {
        agoraRtc.warningListener(function(ret) {
            console.log(JSON.stringify(ret))
        });
    }




    // 打开音频
    _this.oAudio = function() {
        agoraRtc.enableAudio(function(ret) {
            console.log(JSON.stringify(ret))
            if (ret.code == 0) {
                //success
            }
        });
    }

    // 关闭音频
    _this.cAudio = function() {
        agoraRtc.disableAudio(function(ret) {
            console.log(JSON.stringify(ret))
            if (ret.code == 0) {
                //success
            }
        });
    }





    // 暂停频道内音频
    _this.pAudio = function() {
        agoraRtc.pauseAudio(function(ret) {
            console.log(JSON.stringify(ret))
            if (ret.code == 0) {
                //success
            }
        });
    }


    // 恢复频道内音频
    _this.rAudio = function() {
        agoraRtc.resumeAudio(function(ret) {
            console.log(JSON.stringify(ret))
            if (ret.code == 0) {
                //success
            }
        });
    }

    // 静音、取消静音 true: 麦克风静音 false: 取消静音 本地
    _this.quietMy = function(mute) {
        agoraRtc.muteLocalAudioStream({
            mute: mute
        }, function(ret) {
            console.log(JSON.stringify(ret))
            if (ret.code == 0) {
                //success
            }
        });
    }

    // 控制所有远端用户静音与否 true: 停止接收和播放所有远端音频流 false: 允许接收和播放所有远端音频流
    _this.quietAll = function(mute) {
        agoraRtc.muteAllRemoteAudioStreams({
            mute: mute
        }, function(ret) {
            console.log(JSON.stringify(ret))
            if (ret.code == 0) {
                //success
            }
        });
    }

    // 对指定用户静音
    _this.quiteOther = function(mute, uid) {
        agoraRtc.muteRemoteAudioStream({
            uid: uid,
            mute: mute
        }, function(ret) {
            if (ret.code == 0) {
                // success
            }
        });
    }




    // 频道模式
    /* 0: Communication, 用于常见的一对一或群聊，频道中的任何用户可以自由说话
    1: LiveBroadcasting, 直播模式有主播和观众两种用户角色，可以通过调用 setClientRole 设置。主播可收发语音和视频，但观众只能收，不能发
    2: Game, 频道内任何用户可自由发言。该模式下默认使用低功耗低码率的编解码器 */
    _this.channel = function() {
        agoraRtc.setChannelProfile({
            profile: 0
        }, function(ret) {
            console.log(JSON.stringify(ret))
            if (ret.code == 0) {
                //success
            }
        });
    }

    // 监听token是否过期
    _this.listenToken = function() {
        agoraRtc.requestTokenListener(function() {
            // agoraRtc.renewToken({token:'new token'});
        });
    }

    // 更新token
    _this.rToken = function(t) {
        agoraRtc.renewToken({
            token: t
        }, function(ret) {
            console.log(JSON.stringify(ret))
            if (ret.code == 0) {
                //success
            }
        });
    }
    _this.switchC = function() {
        agoraRtc.switchCamera(function(ret, err) {
            console.log(JSON.stringify(ret))
            console.log(JSON.stringify(err))
            if (ret.code == 0) {
                //success
            }
        });
    }
}