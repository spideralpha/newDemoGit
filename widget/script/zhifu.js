//支付的js
(function(window) {
    var pay = function pay(price, info) {
        this.price = price;
        this.info = info;
    };
    //支付A支付
    pay.prototype.zhifubao = function(callback) {
        var obj = api.require('aliPayPlus');
        obj.payOrder({
            orderInfo: htmlRestore(this.info.url),
            sandbox: false
        }, function(ret, err) {
            if (ret.code == 9000) {
                callback && callback(true);
            } else if (ret.code == 4000) {
                alert('系统异常,错误码:4000')
                callback && callback(false)
            } else if (ret.code == 4001) {
                alert('数据格式不正确,错误码:4001')
                callback && callback(false)
            } else if (ret.code == 4003) {
                alert(escape_a + '账户被冻结或不允许支付,错误码:4003')
                callback && callback(false)
            } else if (ret.code == 4003) {
                alert(escape_a + '账户被冻结或不允许支付,错误码:4003')
                callback && callback(false)
            } else if (ret.code == 4006) {
                alert('订单支付失败,错误码:4006')
                callback && callback(false)
            } else if (ret.code == 6001) {
                api.toast({
                    msg: '订单支付已被取消'
                });
                callback && callback(false)
            } else if (ret.code == 0001) {
                alert('支付模块缺少商户id等商户配置信息,错误码:0001')
                callback && callback(false)
            } else if (ret.code == 0002) {
                alert('支付模块缺少（subject、body、amount、tradeNO）等参数,错误码:0002')
                callback && callback(false)
            } else if (ret.code == 0003) {
                alert('支付模块中的公钥密钥与' + escape_a + '上配置的不一致,错误码:0003')
                callback && callback(false)
            } else {

                callback && callback(false)
            }
        });
    };
    pay.prototype.weixinzhifu = function(callback) {
        var price = this.price;
        var info = this.info;
        if (info.number) {
            // 后端返回的仍为订单号 则需通过接口请求vx信息
            _ajax('api/Wechat/app', function(ret, err) {
                if (ret && ret.code == 200) {
                    _payw(ret.data, callback)
                } else {
                    callback && callback(false);
                }
            }, {
                zongjia: price, //支付的价格
                danhao: info.number, //单号
            })
        } else {
            _payw(info, callback)
        }
    };
    window.pay = pay;

    function htmlRestore(str) {
        var s = "";
        if (str.length === 0) {
            return "";
        }
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        return s;
    }
})(window);

function _payw(back_info, callback) {
    var weiXin = api.require('wxPayPlus');
    weiXin.payOrder({
        orderId: back_info.prepayid,
        mchId: back_info.partnerid,
        nonceStr: back_info.noncestr,
        timeStamp: back_info.timestamp,
        package: back_info.package,
        sign: back_info.sign,
    }, function(ret, err) {
        if (ret.status) {
            api.toast({
                msg: '支付成功',
            });
            api.sendEvent({
                name: 'money_get',
            });
            callback && callback(true);
        } else {
            if (err.code == 2) {
                api.toast({
                    msg: '支付失败',
                });
            }
            callback && callback(false);
        }
    });
}

// 2支付A 3vx
function openOtherPay(data, callback) {
    var money = data.money;
    var info = data.info;
    var payType = data.payType;
    if (!info) {
        info = {
            number: data.number
        }
    }

    var pays = new pay(money, info);
    if (payType == 'pay_a') {
        pays.zhifubao(function(win) {
            _loadingClose();
            if (win) {
                if (typeof callback == 'function') {
                    callback();
                } else {
                    _msg('支付成功');
                    timerWin();
                }
            } else {
                _msg('支付失败');
            }
        });
    } else {
        pays.weixinzhifu(function(win) {
            _loadingClose();
            if (win) {
                if (typeof callback == 'function') {
                    callback();
                } else {
                    _msg('支付成功');
                    timerWin();
                }
            } else {
                _msg('支付失败');
            }
        });
    }
}