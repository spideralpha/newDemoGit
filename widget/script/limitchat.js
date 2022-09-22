// 判断权限 联系方式
function judgeQx(touserid, callback) {
    callback();
    return;
    var sex = $api.getStorage('sex');
    var myuserid = $api.getStorage('userid');
    _ajax('home/user/vipsee', function(ret, err) {
        console.log(JSON.stringify(ret));
        console.log(JSON.stringify(err));
        if (ret.code == 200) {
            if (ret.num == 0) {
                callback();
            } else {
                // 使用特权
                useTeQuan({
                    num: ret.num,
                    touserid: touserid
                }, callback)
            }
        } else if (ret.code == 201) {
            _alert('您还未认证，请先去认证', function() {
                _url({
                    url: 'frame4/authentication_frame',
                    title: '认证身份'
                });
            })
        } else if (ret.code == 202) {
            // 非会员购买 与会员金额不同
            // payMoneyGetRight({money:ret.money,touserid:touserid}, callback)
            var obj = {
                msg: '您还不是会员，成为会员才能进行该操作，或者支付' + ret.money + '获取本次操作权限~',
                btn: ['开通会员', '确定购买'],
            }
            _confirm(obj, function(bIndex) {
                if (bIndex == 1) {
                    openVIP();
                } else if (bIndex == 2) {
                    payMoneyGetRight({
                        money: ret.money,
                        touserid: touserid
                    }, callback)
                }
            })

        } else if (ret.code == 205) {
            callback();
        } else if (ret.code == 220) {
            // if(sex == '女'){
            //     _msg('您今日特权使用次数已用完');
            //     return;
            // }
            // 会员 不可使用特权 进行购买
            // payMoneyGetRight({money:ret.money,touserid:touserid}, callback)
            vipNumIsLimit({
                money: ret.money,
                touserid: touserid
            }, callback)
        }
    }, {
        user_id: myuserid,
        to_user: touserid,
    })
}


// 判断权限 联系方式
function judgeLinkQx(touserid, callback, linkType) {
    var myuserid = $api.getStorage('userid');
    _ajax('home/user/vipsee', function(ret, err) {
        console.log(JSON.stringify(ret));
        console.log(JSON.stringify(err));
        if (ret.code == 200) {
            if (ret.num == 0) {
                callback();
            } else {
                // 使用特权
                useTeQuan({
                    num: ret.num,
                    touserid: touserid,
                    linkType: linkType
                }, callback)
            }
        } else if (ret.code == 201) {
            _alert('您还未认证，请先去认证', function() {
                _url({
                    url: 'frame4/authentication_frame',
                    title: '认证身份'
                });
            })
        } else if (ret.code == 202) {
            // 非会员购买 与会员金额不同
            // payMoneyGetRight({money:ret.money,touserid:touserid}, callback)
            var obj = {
                msg: '您还不是会员，成为会员才能进行该操作，或者支付' + ret.money + '获取本次操作权限~',
                btn: ['开通会员', '确定购买'],
            }
            _confirm(obj, function(bIndex) {
                if (bIndex == 1) {
                    openVIP();
                } else if (bIndex == 2) {
                    payMoneyGetRight({
                        money: ret.money,
                        touserid: touserid,
                        linkType: linkType
                    }, callback)
                }
            })
        } else if (ret.code == 203) {
            // 非会员购买 与会员金额不同
            var obj = {
                msg: ret.min_noble_name + '才有此权限，开通贵族。或者支付' + ret.money + '金币，获取本次操作权限~',
                btn: ['开通贵族', '确定购买'],
            }
            _confirm(obj, function(bIndex) {
                if (bIndex == 1) {
                    openVIP(ret.min_noble_grade - 1);
                } else if (bIndex == 2) {
                    payMoneyGetRight({
                        money: ret.money,
                        touserid: touserid,
                        linkType: linkType
                    }, callback)
                }
            })

        } else if (ret.code == 205) {
            callback();
        } else if (ret.code == 220) {
            // if(sex == '女'){
            //     _msg('您今日特权使用次数已用完');
            //     return;
            // }
            // 会员 不可使用特权 进行购买
            // payMoneyGetRight({money:ret.money,touserid:touserid}, callback)
            vipNumIsLimit({
                money: ret.money,
                touserid: touserid,
                linkType: linkType
            }, callback)
        }
    }, {
        user_id: myuserid,
        to_user: touserid,
        types: linkType
    })
}

// 查看私聊权限
function checkChat(touserid, callback) {
    // var myuserid = $api.getStorage('userid');
    judgeQx(touserid, callback)
    return;
    _ajax('home/user/viptalk', function(ret, err) {
        if (ret.code == 200) {
            if (ret.num == 0) {
                callback();
            } else {
                useTeQuan({
                    urlType: 1,
                    num: ret.num,
                    touserid: touserid
                }, callback)
            }
        } else if (ret.code == 205) {
            // 有权限
            callback()
        } else if (ret.code == 201) {
            // 女性 非认证
            _alert('您还未认证，请先去认证', function() {
                _url({
                    url: 'frame4/authentication_frame',
                    title: '认证身份'
                });
            })
        } else if (ret.code == 220) {
            // 女性特权使用达上限
            _msg('您今日特权使用次数已用完');
        } else if (ret.code == 202) {
            // 非会员
            payMoneyGetRight({
                urlType: 1,
                money: ret.money,
                touserid: touserid
            }, callback)
        } else if (ret.code == 204) {
            // 会员次数已达上限
            vipNumIsLimit({
                money: ret.money,
                touserid: touserid
            }, callback)
        }
    }, {
        user_id: myuserid,
        to_user: touserid
    })
}

// 仍有特权 使用特权
function useTeQuan(data, callback) {
    var num = data.num;
    var touserid = data.touserid;
    var myuserid = $api.getStorage('userid');
    // var url = data.urlType == 1 ? 'home/user/Inctalk' : 'home/user/getlink';// 使用一次私聊，使用一次查看联系方式
    var url = 'home/user/getlink'; // 使用一次私聊，使用一次查看联系方式
    var obj = {
        msg: '您今日特权次数还剩余' + num + '次,请确定以下操作',
    };
    _confirm(obj, function(bIndex) {
        if (bIndex == 1) {
            _ajax(url, function(rets, errs) {
                console.log(JSON.stringify(rets));
                console.log(JSON.stringify(errs));
                if (rets && rets.code == 200) {
                    if (typeof callback == 'function') {
                        callback();
                    }
                } else {
                    _msg(rets.msg);
                }
            }, {
                user_id: myuserid,
                to_user: touserid,
                types: data.linkType
            })
        }
    })
}

// 付费私聊、查看
function payMoneyGetRight(data, callback) {
    var money = data.money;
    var touserid = data.touserid;
    var myuserid = $api.getStorage('userid');
    if (!money) {
        callback();
        return;
    }
    // if(data.urlType == 1){
    //     // 私聊
    //     var buttons = ['付费私聊' + money + '币', '购买会员'];
    //     var title =  '解锁与该用户的私聊权限';
    //     var url = 'home/user/buyChat';
    // }else{
    //     // 查看
    var buttons = ['付费查看' + money + '币'];
    var title = '解锁该用户的联系方式';
    var url = 'home/user/buylian';
    // }
    // _action(title, buttons, function (bIndex) {
    //     if(bIndex != buttons.length+1){
    //         if (bIndex == 1) {
    _ajax(url, function(rets, errs) {
        console.log(JSON.stringify(rets));
        console.log(JSON.stringify(errs));
        if (rets && rets.code == 200) {
            pushMsg(myuserid); // 给自己推
            callback();
        } else {
            _msg(rets.msg);
            if (rets.msg.indexOf('不足') != -1 || rets.msg.indexOf('不够') != -1) {
                // showDetail('frame4/show_chong');
                _url({url:'frame4/chongzhicenter',title:'充值中心'})
            }

        }
    }, {
        user_id: myuserid,
        to_user: touserid,
        types: data.linkType
    })
    //         } else if (bIndex == 2) {
    //             if(data.urlType == 1 ){
    //                 // 私聊
    //                openVIP();
    //             }
    //         }
    //     }
    // })
}

// 会员特权次数已达上限
function vipNumIsLimit(data, callback) {
    var money = data.money;
    var touserid = data.touserid;
    var myuserid = $api.getStorage('userid');
    if (!money) {
        callback();
        return;
    }
    // 会员次数已达上限
    var obj = {
        msg: '您今日特权使用次数已用完,您可以支付' + money + '与该用户私聊。请确定以下操作',
        btn: ['购买', '取消'],
    };
    _confirm(obj, function(bIndex) {
        if (bIndex == 1) {
            _ajax('home/user/buylian', function(rets, errs) {
                console.log(JSON.stringify(rets));
                console.log(JSON.stringify(errs));
                if (rets && rets.code == 200) {
                    pushMsg(myuserid); // 给自己推
                    callback();
                } else {
                    _msg(rets.msg);
                    if (rets.msg.indexOf('不足') != -1 || rets.msg.indexOf('不够') != -1) {
                        // showDetail('frame4/show_chong');
                        _url({url:'frame4/chongzhicenter',title:'充值中心'})
                    }
                }
            }, {
                user_id: myuserid,
                to_user: touserid,
                types: data.linkType
            })
        }
    })
}


// 打开连麦
function openLM(touserid, wN, intimate) {
    getPermission(['microphone'], function(code) {
        if (code != 0) {
            _msg('请先开启相关权限');
        } else {
            _url({
                winName: wN,
                id: touserid,
                type: -1,
                slidBackEnabled: 0,
                intimate: intimate,
                to_type: wN == 'index_win' ? 'pipei' : ''
            }, 'frame0/lianmai');

        }
    })
}

// 打开视频聊天
function openVideoChat(touserid, wN, intimate) {
    getPermission(['microphone', 'camera', 'photos'], function(code) {
        if (code != 0) {
            _msg('请先开启相关权限');
        } else {
            _url({
                winName: wN,
                id: touserid,
                type: -1,
                slidBackEnabled: 0,
                intimate: intimate
            }, 'frame0/videochat');

        }
    })
}