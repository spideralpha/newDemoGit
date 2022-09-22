var view = new Vue({
    el: '#view',
    data: {
        ffList: [],
        ffInfo: {}, // 自己的用户信息
        otherInfo: {}, // 对方的用户信息
        payType: -1, // 0 平台币 1现金
        payIndex: 0, // 支付方式 1余额 2支付A 3vx
    },
    methods: {
        _url(param, url) {
            _url(param, url);
        },
        // 返回图片路径
        returnImg(url) {
            return returnImg(url);
        },
    }
})

// 格式化输入
function limitNum(obj) {
    obj.value = obj.value.replace(/[^0-9]*$/, "");
    obj.value = parseInt(obj.value);
}

// 格式化输入
function limitMoney(obj) {
    obj.value = obj.value.replace(/[^0-9.]*$/, ""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    var money = obj.value || '0.00';
    $('#js-money').text('￥' + money);
}
// 选择支付方式
function selectType() {
    var money = $.trim($('.money input').val());
    if (!money || Number(money) <= 0) {
        _msg('请输入金额');
        return;
    }
    if (view.payType == 1) {
        // 现金
        if (!PAY_A) {
            view.payIndex = 3;
            submit(money);
        } else {
            var buttons = [escape_a, escape_w]; // 1,2,3
            var payIndex = [2, 3];
            _action('选择支付方式', buttons, function(bIndex) {
                if (bIndex != buttons.length + 1) {
                    view.payIndex = payIndex[bIndex - 1];
                    submit(money);
                }
            })
        }
    } else if (view.payType == 0) {
        view.payIndex = 1
        // 平台币
        if (!parseInt(view.ffInfo.paypwd)) {
            showDetail('frame4/paypwd');
            return;
        }
        showDetail('frame4/go_pay', {
            money: money,
            event: 'hongbao_pwd'
        });

    }
}

// 发红包
function submit(money, callback, pwd) {
    var content = $.trim($('#js-content').val());
    if (!content) {
        content = '恭喜发财，大吉大利';
    }
    _loading();
    if (view.otherInfo.pull_black == 1) {
        _msg('对方已拉黑您');
        return;
    }
    _ajax('home/Privatechat/addTalk', function(ret, err) {
        console.log(JSON.stringify(ret));
        console.log(JSON.stringify(err));
        if (ret) {
            _msg(ret.msg);
        }
        if (typeof callback == 'function') {
            callback();
        }
    }, {
        money: money,
        ways: view.payIndex,
        content: content,
        type: 5,
        userid: $api.getStorage('userid'),
        touserid: touserid,
    })
}