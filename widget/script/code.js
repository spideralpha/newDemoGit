// 获取验证码
function getCode(regType) {
    var phone = $.trim($('.phone input').val());
    if (!checkMobile(phone)) {
        _msg('手机号不正确');
        console.log('手机号不正确');
        return;
    }
    var status = $('.get-code').attr('data-status');
    if (status != 0) return;

    var deviceId = api.deviceId;
    // 判断是否注册
    if (regType == 1) {
        _ajax('home/user/sel', function(ret, err) {
            if (ret.code != 200) {
                _msg('手机号已经被注册');
            } else {
                _sms(phone)
            }
        }, {
            phone: phone
        })
    } else {
        _sms(phone)
    }

    function _sms(phone) {
        _ajax('api/code/sms', function(rets, errs) {
            _msg(rets.msg);
            if (rets && rets.code == 200) {
                downTime();
            }
        }, {
            phone: phone,
            deviceId: deviceId,
        })
    }
}

// 倒计时
function downTime() {
    var i = 60;
    $('.get-code').attr('data-status', 1);
    var time = setInterval(function() {
        i--;
        if (i == 0) {
            clearInterval(time);
            $('.get-code').attr('data-status', 0)
            $('.get-code').text('重新获取');
            return;
        }
        $('.get-code').text('重新发送 ' + i + ' s');
    }, 1000)
}