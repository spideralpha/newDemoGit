// 发消息
function sendMsg(data) {
    var obj = {
        type: data.type,
        content: data.content,
        touserid: view.touserid,
        userid: view.userid,
    }
    var url = 'home/Privatechat/addTalk';

    if (view.info.blacklist == 1) {
        _msg('对方已拉黑您/您已拉黑对方');
        return;
    }
    if (data.type == 1) {
        // 图片
        _upImg({
            image: data.content
        }, function(u) {
            obj.content = u;
            obj.is_burn = data.is_burn || 0;
            _ajax(url, function(ret, err) {
                if (ret) {
                    if (ret.code == 300) {
                        showChong();
                    } else {
                        _msg(ret.msg);
                    }
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
                    if (ret.code == 300) {
                        showChong();
                    } else {
                        _msg(ret.msg);
                    }
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
                        if (ret.code == 300) {
                            showChong();
                        } else {
                            _msg(ret.msg);
                        }
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
        console.log(JSON.stringify(obj));
        // 文本 / 定位
        _ajax(url, function(ret) {
            if (ret) {
                if (ret.code == 300) {
                    showChong();
                } else {
                    _msg(ret.msg);
                }
            }
        }, obj)
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

// 更新聊天消息状态
function updateMsg() {
    for (var i = 0, len = view.ffList.length; i < len; i++) {
        view.ffList[i].isRead = 1;
    }
}

// 打开阅后即焚的详情
function openBurn(index) {
    var data = view.ffList[index];
    var touid = data.self == 1 ? view.touserid : view.userid; // 接收消息方
    var uid = data.self == 1 ? view.userid : view.touserid; // 接收消息方
    console.log(JSON.stringify(data));
    _url({
        id: data.id,
        img: returnImg(data.content),
        uid: uid, // 消息所属用户
        touid: touid, // 接收消息方
        is_burn: data.is_burn,
        url: 'frame0/burn_detail',
        title: '详情'
    });
}
// 更新焚毁情况
function updateBurn(rets) {
    var id = rets.data.id;
    var $this = $('#id' + id);
    var index = $this.index();
    if (index > -1) {
        // view.ffList[index - 1].is_burn = -1;
        view.ffList[index].is_burn = -1;
    }
    if (rets.msg) {
        _msg(rets.msg);
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


// 点击红包
function openRed(index) {
    var data = view.ffList[index];
    console.log(JSON.stringify(data))
    if (data.self == 1) {
        // 自己发的红包
        var u = data.type == 5 ? 'frame0/hong_bao_detail' : 'frame0/money_detail';
        _url({
            id: data.id
        }, u);
    } else {
        // 对方发的红包
        if (data.state == 0) {
            // 未领取
            var u = data.type == 5 ? 'frame0/hong_bao' : 'frame0/money';
            showDetail(u, {
                id: data.id,
                touserid: view.touserid
            });
        } else {
            // 已领取 查看详情
            var u = data.type == 5 ? 'frame0/hong_bao_detail' : 'frame0/money_detail';
            _url({
                id: data.id
            }, u);
        }
    }
}



// 更新红包状态
function updateHongbao(id, state) {
    var $this = $('#id' + id);
    var index = $this.index();
    // view.ffList[index - 1].state = state;
    if (index > -1) {
        view.ffList[index].state = state;
    }
}

// 打开连麦
function openLM() {
    if (view.otherInfo.pull_black == 1) {
        _msg('对方已拉黑您');
        return;
    }
    getPermission(['microphone'], function(code) {
        if (code != 0) {
            _msg('请先开启相关权限');
        } else {
            _url({
                id: view.touserid,
                type: -1,
                slidBackEnabled: 0
            }, 'frame0/lianmai');
            return;
            // 获取配置信息
            _ajax('api/member/config', function(ret, err) {
                if (Number(ret.data.recharge) == 0) {
                    // 如果不需要付费
                    _url({
                        id: view.touserid,
                        type: -1,
                        slidBackEnabled: 0
                    }, 'frame0/lianmai');
                    return;
                }
                // 需要付费
                var obj = {
                    msg: '若接通成功需支付 ' + ret.data.recharge + ' 币，请谨慎操作'
                }
                _confirm(obj, function(bIndex) {
                    if (bIndex == 1) {
                        if (Number(view.userInfo.volley) < ret.data.recharge) {
                            // 余额不足
                            _alert('余额不足', function() {
                                showDetail('frame4/show_chong');
                            })
                        } else {
                            _url({
                                id: view.touserid,
                                type: -1,
                                slidBackEnabled: 0
                            }, 'frame0/lianmai');
                        }
                    }
                })
            })
        }
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
    if (msgType == 2 || msgType == 5 || msgType == 7) {
        return;
    }
    var buttons = msgType == 0 ? ['撤回', '删除', '复制'] : ['撤回', '删除'];
    _action('', buttons, function(bIndex) {
        if (bIndex != buttons.length + 1) {
            if (bIndex == 1) {
                // 撤回
                _ajax('home/privatechat/recall', function(ret, err) {
                    _msg(ret.msg);
                    if (ret && ret.code == 200) {
                        recallCss(id);
                    }
                }, {
                    chat_id: id,
                    user_id: view.userid
                })
            } else if (bIndex == 2) {
                // 删除
                _ajax('home/privatechat/delete', function(ret, err) {
                    _msg(ret.msg);
                    if (ret && ret.code == 200) {
                        var data = view.ffList;
                        for (var i = data.length - 1; i >= 0; i--) {
                            if (data[i].id == id) {
                                view.ffList.splice(i, 1);
                                break;
                            }
                        }
                    }
                }, {
                    chat_id: id,
                    user_id: view.userid
                })

            } else if (bIndex == 3) {
                copyTxt(text);
            }
        }
    })
}

// 设置与该用户聊天已读
function setRead() {
    if (view.isResume == 0) {
        pushMsg(view.userid); // 推给自己
        pushMsg(view.touserid); // 推给对方
        return;
    }
    var obj = {
        user_id: view.userid,
        touserid: view.touserid,
    }
    // 修改对方消息 阅读情况
    _ajax('Home/Privatechat/changeread', function(ret, err) {
        // 改变自己和该用户的消息数
        _ajax('Home/Privatechat/changecount', function(ret, err) {
            pushMsg(view.userid); // 推给自己
            pushMsg(view.touserid); // 推给对方
        }, obj)
    }, obj)
}


// 提醒
function chatNotice(arr) {
    var brr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        var txt = '';
        if (arr[i].val) {
            txt = arr[i].val;
        }
        var notice = {
            rz: `对方尚未通过真人认证，请谨慎交谈`,
            gz: `每条消息需支付${txt}金币，互相关注后免费`,
            pian: `去到外部聊天工具（${escape_w}、qq等）涉及金钱相关内容，请保持高度警惕，谨防被骗，在小火苗聊天，安全有保障。<br><br><a onclick="_url({url:'about', id:8, title:'防骗指南'})">小火苗防骗指南</a>建议您先发起视频通话查验对方真身`,
            limit: `今日免费消息数已用完，做任务和充值都可获取金币继续嗨聊，互相关注后消息免费<br><br><a onclick="_url({url:'frame4/renwu',title:'每日任务'})">免费赚币</a><br><br><a onclick="_url({url:'frame4/chongzhicenter',title:'充值中心', moreTitle: '账单'})">去充值</a>`,
            score: `恭喜你们亲密度已超过${txt}°C，解锁了语音和视频通话，给TA语音或视频嗨聊下吧`
        }
        var obj = {
            type: -1,
            id: 0,
            state: 0,
            content: notice[arr[i].key]
        }
        brr.push(obj);
    }
    return brr;
}