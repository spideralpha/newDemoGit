// 扣费
function payForChat(to_type = '') {
    _ajax('api/member/createMic', function(ret, err) {
        if (ret && ret.code != 200) {
            _leave();
            returnStatus(2,'', ret.recharge_user_id);
            _alert(ret.msg, function() {
                setOnline(1)
                _closeChat();
            })
            api.closeWin({
                name: 'frame0/video_virtual'
            });
        } else {
            setTimeout(function() {
                payForChat(to_type);
            }, 60000)
        }
    }, {
        user_id: view.myuserid,
        orderid: view.order,
        to_type: to_type
    })
}

//  检查权限 创建订单
function createOrder(callback,to_type = '') {
    _ajax('api/member/checkMic', function(rets, errs) {
        console.log(JSON.stringify(rets))
        console.log(JSON.stringify(errs))
        if (rets.code == 200) {
            view.order = rets.data.orderid;
            callback();
        } else {
            // 无权限
            _leave();

            if (to_type == 'pipei') {
                _msg(rets.msg);
                setTimeout(function() {
                    refuse();
                }, 2000)
            } else {
                _alert(rets.msg, function() {
                    _closeChat();
                })
            }
        }
    }, {
        user_id: view.myuserid,
        to_user: view.touserid,
        types: view.types,
        intimate: view.intimate,
        to_type: to_type
    })
}

// 发起 要求后端推送B方
function sendB(toType = '') {
    _join(view.myuserid);
    $api.setStorage('callStatus', 1); // 正在通话中
    _ajax('home/Privatechat/toRequest', function() {
        var i = 60;
        var dt = setInterval(function() {
            i--;
            if (view.status == 1) {
                clearInterval(dt);
                dt = null;
                return;
            }
            console.log(i);
            if (i == 0) {
                _leave();
                _msg('对方未接受邀请');
                clearInterval(dt);
                dt = null;
                returnStatus(0); // 推给对方
                _closeChat(1);
                return;
            }
        }, 1000)
    }, {
        user_id: view.touserid,
        another_id: view.myuserid,
        channel: 'channel' + view.myuserid,
        types: view.types, //  1语音|2视频
        orderid: view.order, // 订单id
        from_type: toType ? 'pipei' : 'origin'
    })
}

// 接听 接收方
function call() {
    var button = view.types == 1 ? ['microphone'] : ['microphone', 'camera', 'photos', 'storage'];
    getPermission(button, function(code) {
        if (code != 0) {
            _msg('请先开启相关权限');
        } else {
            view.type = 1;
            _join(view.touserid);
            $api.setStorage('callStatus', 1); // 正在通话中
            showCallTime();
            returnStatus(1); // 推给对方 表示已接听
        }
    })

}

// 拒绝
function refuse(status, uid, close) {
    _leave();
    if (!status) {
        var arr = ['取消', '拒绝', '挂断'];
        _msg('已' + arr[view.type + 1]);
    } else {
        _msg('已取消');
    }
    returnStatus(status, uid);
    if (!close) {
        _closeChat(1);
    }
}



// 返回状态 user_id为被推送方  0 取消 1接听 2无权限
function returnStatus(status, uid, recharge_user_id = 0) {
    uid = uid ? uid : view.myuserid;
    _ajax('home/Privatechat/returnRequest', function() {}, {
        user_id: view.touserid,
        another_id: uid,
        channel: 'channel' + uid,
        status: status || 0,
        types: view.types, //  1语音|2视频
        orderid: view.order, // 订单id
        recharge_user_id: recharge_user_id
    })
}

// 通话时间
function showCallTime() {
    // 上传本地音频
    api.execScript({
        name: api.winName,
        script: 'stopAudio()'
    })
    var t = 0;
    var time = setInterval(function() {
        t++;
        var mm = Math.floor(t / 60);
        var ss = t - mm * 60;
        var m = mm < 10 ? '0' + mm : mm;
        var s = ss < 10 ? '0' + ss : ss;
        view.time = m + ':' + s;
    }, 1000)
}

function _closeChat(time) {
    if (time) {
        timerWin();
    } else {
        api.closeWin();
    }
}