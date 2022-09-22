var UIBOX = function() {
    var _this = this;
    var UIChatBox = api.require('UIChatBox');

    // 打开聊天框
    _this.open = function(eArr, callback) {
        UIChatBox.open({
            placeholder: '',
            maxRows: 4,
            // disableSendMessage: true,
            // placeholder: '禁言中',
            emotionPath: 'widget://res/img/emotion',
            texts: {
                recordBtn: {
                    normalTitle: '按住说话',
                    activeTitle: '松开结束',
                },
                sendBtn: {
                    title: '发送',
                },
            },

            styles: {

                inputBar: {
                    borderColor: '#d9d9d9',
                    bgColor: '#f2f2f2',
                },
                inputBox: {
                    borderColor: '#B3B3B3',
                    bgColor: '#FFFFFF',
                },
                emotionBtn: {
                    normalImg: 'widget://res/img/face.png',
                },
                extrasBtn: {
                    normalImg: 'widget://res/img/jia.png',
                },
                keyboardBtn: {
                    normalImg: 'widget://res/img/jian_pan.png',
                },
                speechBtn: {
                    normalImg: 'widget://res/img/lu_yin.png',
                },
                recordBtn: {
                    normalBg: '#fff',
                    activeBg: '#c4c4c4',
                    color: '#F46CEF',
                    size: 14,
                },
                indicator: {
                    target: 'both',
                    color: '#c4c4c4',
                    activeColor: '#9e9e9e',
                },
                sendBtn: {
                    titleColor: '#fff',
                    bg: '#F46CEF',
                    activeBg: '#F46CEF',
                    titleSize: 14,
                },
            },
            extras: {
                titleSize: 10,
                titleColor: '#a3a3a3',
                btns: eArr,
            },
        }, function(ret, err) {
            if (ret) {
                if (typeof callback == 'function') {
                    callback(ret);
                }
                // 隐藏附加面板
                UIChatBox.closeBoard();
            } else {
                console.log(JSON.stringify(err));
            }
        })

    }
    // 关闭面板
    _this.close = function() {
        UIChatBox.closeBoard();
    }
    // 显示
    _this.show = function() {
        UIChatBox.show();
    }
    // 隐藏
    _this.hide = function() {
        UIChatBox.hide();
    }
    // 监听录音按钮 长按
    _this.record = function(callback) {
        UIChatBox.addEventListener({
            target: 'recordBtn',
            name: 'press',
        }, function(ret, err) {
            if (ret) {
                var micResult = api.hasPermission({
                    list: ['microphone', 'storage']
                });
                if (!micResult[0].granted) {
                    getPermission(['microphone', 'storage'], function(code) {
                        if (code != 0) {
                            _msg('请先开启相关权限');
                        }
                    })
                } else {
                    if (typeof callback == 'function') {
                        callback()
                    }
                }
            } else {
                alert(JSON.stringify(err));
            }
        });
    }
    // 监听录音按钮 滑动
    _this.recordMove = function(callback) {
        UIChatBox.addEventListener({
            target: 'recordBtn',
            name: 'move_out',
        }, function(ret, err) {
            if (ret) {
                if (typeof callback == 'function') {
                    callback()
                }
            } else {
                alert(JSON.stringify(err));
            }
        });
    }
    // 监听录音按钮 停止
    _this.recordCancel = function(callback) {
        UIChatBox.addEventListener({
            target: 'recordBtn',
            name: 'press_cancel',
        }, function(ret, err) {
            console.log(JSON.stringify(ret))
            console.log(JSON.stringify(err))
            if (ret) {
                if (typeof callback == 'function') {
                    callback()
                }
            } else {
                alert(JSON.stringify(err));
            }
        });
    }

    _this.inputMove = function(callback) {
        //监听 inputBar
        UIChatBox.addEventListener({
            target: 'inputBar',
            name: 'move'
        }, function(ret, err) {
            if (typeof callback == 'function') {
                callback(ret)
            }
        });
    }
    _this.inputExt = function(callback) {
        UIChatBox.addEventListener({
            target: 'inputBar',
            name: 'showExtras'
        }, function(ret, err) {
            if (typeof callback == 'function') {
                callback(ret)
            }
        });
    }
    _this.inputEmo = function(callback) {
        UIChatBox.addEventListener({
            target: 'inputBar',
            name: 'showEmotion'
        }, function(ret, err) {
            if (typeof callback == 'function') {
                callback(ret)
            }
        });
    }


}

// 返回按钮 del为1 表示去除arr中含有的，del=0表示获取arr中的
function returnButton(arr, del) {
    var extrasBtn = {
        '图片': {
            title: '图片',
            normalImg: 'widget://res/img/nim_message_plus_photo_normal.png',
            activeImg: 'widget://res/img/nim_message_plus_photo_normal.png',
        },
        '视频': {
            title: '视频',
            normalImg: 'widget://res/img/nim_message_plus_video_normal.png',
            activeImg: 'widget://res/img/nim_message_plus_video_normal.png',
        },
        '位置': {
            title: '位置',
            normalImg: 'widget://res/img/nim_message_plus_location_normal.png',
            activeImg: 'widget://res/img/nim_message_plus_location_normal.png',
        },
        '阅后即焚': {
            title: '阅后即焚',
            normalImg: 'widget://res/img/message_plus_snapchat_normal.png',
            activeImg: 'widget://res/img/message_plus_snapchat_normal.png',
        },
        // '现金红包': {
        //     title: '现金红包',
        //     normalImg: 'widget://res/img/ic_sendluckybag.png',
        //     activeImg: 'widget://res/img/ic_sendluckybag.png',
        // },
        '红包': {
            title: '红包',
            normalImg: 'widget://res/img/ic_maskdollar.png',
            activeImg: 'widget://res/img/ic_maskdollar.png',
        },
        '连麦': {
            title: '连麦',
            normalImg: 'widget://res/img/ic_voicecall.png',
            activeImg: 'widget://res/img/ic_voicecall.png',
        },
        '常用语': {
            title: '常用语',
            normalImg: 'widget://res/img/quick.png',
            activeImg: 'widget://res/img/quick.png',
        },
        '礼物': {
            title: '礼物',
            normalImg: 'widget://res/img/nim_message_plus_liwu_normal.png',
            activeImg: 'widget://res/img/nim_message_plus_liwu_normal.png',
        }
    }
    var brr = [];
    var keyArr = [];
    if (!arr) {
        for (var k in extrasBtn) {
            brr.push(extrasBtn[k]);
            keyArr.push(k);
        }
    } else {
        if (!del) {
            for (var i = 0, len = arr.length; i < len; i++) {
                brr.push(extrasBtn[arr[i]]);
            }
            keyArr = arr;
        } else {
            for (var i = 0, len = arr.length; i < len; i++) {
                delete extrasBtn[arr[i]];
            }
            for (var k in extrasBtn) {
                brr.push(extrasBtn[k]);
                keyArr.push(k);
            }
        }
    }
    return {
        btnArr: brr,
        keyArr: keyArr
    };
}
// 聊天模块
function editor(btnObj) {
    // var btnObj = view.otherInfo.lianmai_limit != 1 ? returnButton() : returnButton(['连麦'], 1);
    // if (view.ios) {
    //     btnObj = returnButton(['图片', '视频']);
    // }
    var uibox = new UIBOX();
    uibox.open(btnObj.btnArr, function(ret) {
        var type = ret.eventType;
        if (ret.inputBarHeight) {
            view.inputBarHeight = ret.inputBarHeight;
        }
        if (type == 'send') {
            // 发送
            var content = ret.msg;
            if (!$api.trim(content)) {
                _msg('内容不能为空');
                return
            }
            sendMsg({
                type: 0,
                content: content,
            })
        } else if (type == 'clickExtras') {
            uiboxClick(btnObj.keyArr[ret.index]);
        }
    })
    // 录音
    uibox.record(function() {
        console.log('录音中---')
        view.recordTxt = '手指上划，取消发送';
        view.record = 1;
        recMp3.start();
    })
    // 录音取消
    uibox.recordMove(function() {
        console.log('已取消---')
        view.recordTxt = '已取消';
        setTimeout(function() {
            view.record = 0;
            recMp3.stop();
        }, 500)
    })
    // 录音完成
    uibox.recordCancel(function() {
        console.log('录音完成---');
        setTimeout(function() {
            recMp3.stop(function(ret) {
                console.log(JSON.stringify(ret))
                if (ret && ret.status) {
                    if (ret.duration) {
                        if (ret.duration < 1) {
                            view.recordTxt = '录音时间太短';
                            setTimeout(function() {
                                view.record = 0;
                            }, 500)
                        } else {
                            view.record = 0;
                            var path = ret.path;
                            path = path.replace('fs://', api.fsDir + '/');
                            sendMsg({
                                type: 2,
                                second: ret.duration,
                                content: ret.path
                            })
                        }
                    } else {
                        view.recordTxt = '录音时间太短';
                        setTimeout(function() {
                            view.record = 0;
                        }, 500)
                    }
                }
            });
        }, 500)
    })

    // 因表情面板和控件面板按钮点击后 只可监听到面版打开的情况
    uibox.inputMove(function(ret) {
        console.log('面板高度变化')
        console.log(JSON.stringify(ret))
        if (ret) {
            // 面板收起
            if (ret.panelHeight == 0) { // panelHeight输入框下边缘距离屏幕底部的高度
                view.panStatus = 0;
            }
            var h = ret.panelHeight ? ret.panelHeight + api.safeArea.bottom : api.safeArea.bottom;
            view.panelHeight = h;
            goBottom(1);
        }
    })
    uibox.inputExt(function(ret) {
        console.log('控件面板已打开')
        // 控件面板已打开
        view.panNum.input++;
        view.panNum.ext = view.panNum.input;
        view.panStatus = 1;
        console.log(JSON.stringify(view.panNum))
    })
    uibox.inputEmo(function(ret) {
        console.log('表情面板已打开')
        // 表情面板已打开
        view.panNum.input++;
        view.panNum.emo = view.panNum.input;
        view.panStatus = 1;
        console.log(JSON.stringify(view.panNum))
    })
}

// 选择图片
function selectPicType() {
    if ($api.getStorage('shang') == 1) {
        uiboxClick('图片');
        return;
    }
    var btn = ['普通图片', '阅后即焚'];
    _action('', btn, function(bIndex) {
        if (bIndex != btn.length + 1) {
            if (bIndex == 1) {
                uiboxClick('图片');
            } else {
                uiboxClick('阅后即焚');
            }
        }
    })
}

// 点击输入框控件
function uiboxClick(str) {
    console.log(str);
    // ios 点击控件后 面板高度监听未生效
    if (api.systemType == 'ios') {
        view.panelHeight = 0; // 点击控件 面板收起
        goBottom(1);
    }
    switch (str) {
        case '图片':
            openPic(function(result) {
                sendMsg({
                    type: 1,
                    content: result.data,
                });
                _msg("图片发送中...")
            })
            break;
        case '阅后即焚':
            openPic(function(result) {
                sendMsg({
                    type: 1,
                    content: result.data,
                    is_burn: 1,
                });
            })

            break;
        case '视频':
            openPic(function(result) {
                // 封面
                getVideoCover(result.data, function(cover) {
                    sendMsg({
                        type: 3,
                        content: result.data,
                        cover: cover,

                    });
                })
            }, 'video')
            break;
        case '位置':
            getPermission(['location'], function(code) {
                if (code != 0) {
                    _msg('请先开启定位');
                } else {
                    // map.getLocation(function (ret) {
                    //     if (ret.status) {
                    //         sendMsg({
                    //             type: 6,
                    //             content: ret.lon + ',' + ret.lat,
                    //         });
                    //     }
                    // })
                    showDetail('frame0/chat_map', {qunType:view.qunType});
                }
            })
            break;
        case '现金红包':
            _url({
                touserid: view.touserid
            }, 'frame0/fa_money')
            break;
        case '红包':
            _url({
                touserid: view.touserid
            }, 'frame0/fa_hong_bao')
            break;
        case '连麦':
            openLM();
            break;
        case '常用语':
            // showDetail('frame0/cyy', {index:1});
            _url({
                url: 'frame0/cyy',
                title: '常用语',
                moreTitle: '添加'
            })
            break;
        case '礼物':
            showDetail('modal/gift_modal', {
                uid: view.touserid
            });
            break;
        default:
            break;
    }
}


// 滚动到底部
function goBottom(type) {
    var element = document.getElementById('msg-bottom');
    element.scrollIntoView({
        block: "end",
        behavior: "auto"
    });
    setTimeout(function() {
        // console.log('设置底部高度')
        // console.log(JSON.stringify(view.panNum))
        if (api.systemType != 'ios') {
            // 安卓
            if ((view.panStatus == 1) && (view.panNum.input == view.panNum.ext || view.panNum.input == view.panNum.emo)) {
                // 若打开了表情面板 或 控件面板 底部需增加面板高度
                var bh = Number(view.inputBarHeight) + Number(view.panelHeight)
            } else {
                // 安卓 打开键盘无需增加面板高度
                var bh = Number(view.inputBarHeight);
            }
        } else {
            // ios 无论打开键盘还是面板都需要增加面板高度
            var bh = Number(view.inputBarHeight) + Number(view.panelHeight)
        }
        console.log(bh)
        if (type) {
            // 面板高度变化 将面板设为未打开状态 便于下次若打开的是键盘可以判断
            view.panStatus = 0;
            view.panNum.input++;
        }
        // 显示自定义输入框
        if (view.showInput == 1) {
            var footerH = $api.offset($api.dom('footer')).h
            bh = footerH;
        }
        $('#msg-bottom').css({
            'height': bh + 'px'
        });
        // var element = document.getElementById('msg-bottom');
        element.scrollIntoView({
            block: "end",
            behavior: "auto"
        });
    }, 200)
}