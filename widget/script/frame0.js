// 关注
function _sc(uid, index) {
    var _this = this;
    var status = _this.ffList[index].love;
    _ajax('api/user/attention', function(ret, err) {
        console.log(JSON.stringify(ret))
        console.log(JSON.stringify(err))
        if (ret && ret.code == 200) {
            var msg = status == 0 ? '收藏成功' : '取消收藏成功';
            _msg(msg);
            _this.ffList[index].love = status == 0 ? 1 : 0;
            pushMsg(uid);
        }
    }, {
        user_id: $api.getStorage('userid'), //我的用户id
        to_user: uid, //被看用户id
    })
}
// 收藏 & 拉黑
function _scAndBlack(index) {
    var _this = this;
    var uid = _this.ffList[index].user_id;
    var love = _this.ffList[index].love;
    var buttons = love == 0 ? ['收藏', '拉黑'] : ['取消收藏', '拉黑'];
    _action('', buttons, function(bIndex) {
        if (bIndex == 1) {
            var _u = love == 0 ? 'api/user/attention' : 'api/user/attention'
            // 收藏
            _ajax(_u, function(ret, err) {
                console.log(JSON.stringify(ret))
                console.log(JSON.stringify(err))
                if (ret && ret.code == 200) {
                    _msg('操作成功');
                    _this.ffList[index].love = love == 0 ? 1 : 0;
                    pushMsg(uid);
                } else {
                    _msg('操作失败');
                }
            }, {
                user_id: $api.getStorage('userid'),
                to_user: uid,
            })
        } else if (bIndex == 2) {
            // 拉黑
            _addBlack(uid, function(type) {
                if (type == 1) {
                    _this.ffList.splice(index, 1);
                    if (heigutgao == 1) {
                        pagenum++;
                        getData(pagenum);
                    }
                }
            })
        }
    })
}

// 心动
function _dashan(index, obj) {
    var uid = view.ffList[index].user_id;
    var name = view.ffList[index].user_name;
    // var cls = $(obj).hasClass('hi-tags');
    // if (cls) return;
    if (view.ffList[index].dashan == 1) return;
    _ajax('api/privatechat/greet', function(ret, err) {
        _msg(ret.msg);
        if (ret && ret.code == 200) {
            view.ffList[index].dashan = 1;
            view.$forceUpdate();
            // $(obj).addClass('hi-tags');
        }
    }, {
        user_id: $api.getStorage('userid'),
        id: uid,
    })
}
var audio, audioTime;
// 听音频
function openVoice(index) {
    var data = view.ffList[index];
    clearTimeout(audioTime);
    if (view.playIndex == index) {
        view.playIndex = -1;
        audio.stop();
        return;
    }
    view.playIndex = index;
    if (!audio) {
        audio = api.require('audioStreamer');
        audio.setVolume({
            volume: 0.5
        });
    }
    audio.openPlayer({
        path: returnImg(data.voice)
    }, function(ret) {
        console.log(JSON.stringify(ret))
        if (ret && ret.duration) {
            audioTime = setTimeout(function() {
                clearTimeout(audioTime);
                view.playIndex = -1;
                audio.stop();
            }, ret.duration * 1000)
        } else {
            clearTimeout(audioTime);
            view.playIndex = -1;
            audio.stop();
        }
    })
}