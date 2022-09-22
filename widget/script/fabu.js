// 判断发布权限 type:2 普通 6约会
function judegFB(type) {
    if (type == 2) {
        var dyTitle = '动态';
    } else {
        var dyTitle = '约会广播';
    }
    _ajax('home/user/vipdymanic', function(ret, err) {
        if (ret) {
            if (ret.code == 200) {
                if (ret.num) {
                    var obj = {
                        msg: '您将使用1次特权发布' + dyTitle + '(今日剩余' + ret.num + '次会员特权)',
                    }
                    _confirm(obj, function(bIndex) {
                        if (bIndex == 1) {
                            publishDY();
                        }
                    })
                } else {
                    publishDY();
                }
            } else if (ret.code == 201) {
                var obj = {
                    title: '发布失败',
                    msg: '您还未认证，需要你认证后才可以发布' + dyTitle + '。或者支付' + ret.money + '金币，获取本次发布权限~',
                    btn: ['我要认证', '确定购买'],
                }
                _confirm(obj, function(bIndex) {
                    if (bIndex == 1) {
                        _url({
                            url: 'frame4/authentication_frame',
                            title: '认证身份'
                        });
                    } else if (bIndex == 2) {
                        fabuPay(ret.money, function() {
                            publishDY();
                        })
                    }
                })
            } else if (ret.code == 202) {
                showDetail('modal/fabu_modal', {
                    money: ret.money
                })
                // var obj = {
                //     title: '发布失败',
                //     msg: '您还不是会员，成为会员才可以发布'+dyTitle+'。或者支付' + ret.money + '获取本次发布权限~',
                //     btn: ['开通会员', '确定购买'],
                // }
                // _confirm(obj, function(bIndex){
                //     if(bIndex == 1){
                //         openVIP();
                //     }else if(bIndex == 2){
                //         fabuPay(ret.money, function(){
                //             publishDY(); 
                //         })
                //     }
                // })
            } else if (ret.code == 204) {
                var obj = {
                    title: '发布失败',
                    msg: '不好意思，您今日的发布次数已经用完了。支付' + ret.money + '获取本次发布约会权限~',
                    btn: ['确定购买'],
                }
                _confirm(obj, function(bIndex) {
                    if (bIndex == 1) {
                        fabuPay(ret.money, function() {
                            publishDY();
                        })
                    }
                })
            } else if (ret.code == 205) {
                publishDY();
            } else {
                _msg(ret.msg);
            }
        } else {
            _msg('系统错误');
        }
    }, {
        user_id: $api.getStorage('userid'),
        type: type,
    })
}

// 超过特权次数、付费发布
function fabuPay(money, callback) {
    _ajax('home/user/chaoe', function(ret, err) {
        console.log(JSON.stringify(ret))
        console.log(JSON.stringify(err))
        _msg(ret.msg);
        if (ret) {
            if (ret.code == 200 && typeof callback == 'function') {
                callback();
            } else if (ret.code == 220) {
                if (ret.msg.indexOf('不足') != -1) {
                    showDetail('modal/chongzhi_modal')
                    // _url({url:'frame4/chongzhicenter',title:'充值中心'})
                    // showDetail('frame4/show_chong');
                } else {
                    callback();
                }
            }
        }
    }, {
        to_user: $api.getStorage('userid'),
        price: money,
        type: 1,
    })
}