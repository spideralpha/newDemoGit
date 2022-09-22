// 获取个人配置
function getMyConfig() {
    _ajax('api/personal/config', function (ret, err) {
        if (ret && ret.code == 200 && ret.data) {
            view.ffInfo = ret.data;
        }
    }, {
        user_id: $api.getStorage('userid')
    })
}

// 修改隐身信息是否显示
function changeSocial(ziduan, type) {
    if (type && $api.getStorage('isVip') == 0) {
        _alert('您还不是贵族，请开通贵族再进行此操作', function () {
            openVIP();
        })
        return;
    }
    view.ffInfo[ziduan] = view.ffInfo[ziduan] == 1 ? 0 : 1;
    changeConfig(ziduan, view.ffInfo[ziduan])
}

// 修改配置
function changeConfig(key, val) {
    var obj = {
        user_id: $api.getStorage('userid'),
    };
    obj[key] = val;
    _ajax('api/personal/editConfig', function (ret, err) {
        console.log(JSON.stringify(ret))
        console.log(JSON.stringify(err))
        _msg(ret.msg);
    }, obj)
}