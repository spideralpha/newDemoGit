// 发消息
function sendMsg(data) {
    var obj = {
        type: data.type,
        cluster_id: view.touserid,
        user_id: view.userid,
        content: data.content,
    }

    var url = 'api/cluster/addtalk';

    if (data.type == 1) {
        // 图片
        _upImg({
            image: data.content
        }, function(u) {
            obj.content = u;
            obj.is_burn = 0;
            _ajax(url, function(ret, err) {
                if (ret) {
                    _msg(ret.msg);
                }
            }, obj)
        })
    } else if (data.type == 2) {
        // delete obj.content;
        obj.second = data.second || 1;
        // 语音
        pushVideo(data.content, function(v) {
            obj.content = v;
            _ajax(url, function(ret, err) {
                console.log(JSON.stringify(ret))
                if (ret) {
                    _msg(ret.msg);
                }
            }, obj)
        })
    } else if (data.type == 3) {
        // 视频
        pushVideo(data.content, function(v) {
            _upImg({
                image: data.cover
            }, function(vimg) {
                obj.content = v;
                obj.cover = vimg;
                _ajax(url, function(ret) {
                    if (ret) {
                        _msg(ret.msg);
                    }
                }, obj)
            })
        })
    } else {
        if (obj.type == 6) {
            api.closeFrame({
                name: 'frame0/chat_map'
            });
        }
        if (view.isTop && obj.type == 0) {
            obj.is_top = 1;
        }
        if (data.content.indexOf('@') != -1) {
            var arr = view.valObj.arr;
            var brr = [];
            var relates = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                var n = '@' + arr[i].name;
                if (data.content.indexOf(n) != -1) {
                    arr[i].relates = 1;
                    brr.push(arr[i]);
                    relates.push(arr[i].id)
                }
            }
            obj.data = JSON.stringify(brr);
            obj.relates = relates.join(',');
        }
        // 文本 / 定位
        _ajax(url, function(ret) {
            if (ret) {
                _msg(ret.msg);
            }
        }, obj)
    }
}

// 打开视频
function openVideo(index) {
    var data = view.ffList[index];
    // 视频需使用win打开 监听安卓的keyback
    _url({
        video: returnImg(data.content),
        cover: returnImg(data.data.cover),
        animationType: 0
    }, 'frame0/liaotian_video')
}

// 打开地址
function openArea(index) {
    var data = view.ffList[index];
    _url({
        area: data.content,
        url: 'frame0/map',
        title: '位置'
    })
}

// 长按
var timeOutEvent;

function touchstartF(index) {
    var data = view.ffList[index];
    if (data.type == 2) {
        return;
    }
    if (data.type == 5 || data.type == 7) {
        return;
    }
    timeOutEvent = setTimeout(function() {
        timeOutEvent = 0;
        showAction(data.id, data.type, data.content);
    }, 1000);
}

function touchendF(index) {
    clearTimeout(timeOutEvent);
    if (timeOutEvent != 0) {
        // var data = view.ffList[index];
        // _url({
        //     txt: data.name,
        //     touserid: data.touserid,
        //     url: 'frame0/liaotian',
        //     title: '与' + data.name + '的聊天'
        // })
    }
    return false;
}

// 菜单框
function showAction(id, msgType, text) {
    if (msgType != 0 && msgType != 1) {
        return;
    }
    var buttons = msgType == 0 ? ['撤回', '复制'] : ['撤回'];
    _action('', buttons, function(bIndex) {
        if (bIndex != buttons.length + 1) {
            if (bIndex == 1) {
                // 撤回
                _ajax('api/cluster/recall', function(ret, err) {
                    _msg(ret.msg);
                    if (ret && ret.code == 200) {
                        recallCss(id);
                    }
                }, {
                    chat_id: id,
                    user_id: view.userid
                })
                // } else if (bIndex == 2) {
                //     // 删除
                //     _ajax('api/cluster/delete', function(ret, err) {
                //         _msg(ret.msg);
                //         if (ret && ret.code == 200) {
                //             var data = view.ffList;
                //             for (var i = data.length - 1; i >= 0; i--) {
                //                 if (data[i].id == id) {
                //                     view.ffList.splice(i, 1);
                //                     break;
                //                 }
                //             }
                //         }
                //     }, {
                //         chat_id: id,
                //         user_id: view.userid
                //     })
            } else if (bIndex == 2) {
                copyTxt(text);
            }
        }
    })
}

// 设置与该用户聊天已读
function setRead() {
    var obj = {
        user_id: view.userid,
        cluster_id: view.touserid,
    }
    // 修改对方消息 阅读情况
    _ajax('api/cluster/changeread', function(ret, err) {

    }, obj)
}



// 点击红包
function openRed(index) {
    var data = view.ffList[index];
    showDetail('frame0/qun_hb', {
        id: data.id, // 消息id
        touserid: view.touserid, // 群id
        userid: data.userid, // 发红包者
        data: data,
    });
}

// 更新红包状态
function updateHongbao(id, state) {
    var $this = $('#id' + id);
    var index = $this.index();
    if (index > -1) {
        view.ffList[index].state = state;
    }
}


// 移除被撤回消息
function recallCss(id) {
    var data = view.ffList;
    for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].id == id) {
            data[i].status = 3;
            break;
        }
    }
}