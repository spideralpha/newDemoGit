function judgeRZ(m) {
    var data = m.data;
    // 有认证的前提条件
    if (data && data.name) {
        // 认证的前提条件正在审核中
        if (data.status == 1) {
            _msg(data.content);
            return;
        }
        var obj = {
            msg: data.content,
            btn: [data.desc],
        }
        _confirm(obj, function(bIndex) {
            if (bIndex == 1) {
                openRZWin(data);
            }
        })
    } else {
        console.log(JSON.stringify(m))
        if (m.status == 2) {
            // 已认证
            openReadyRZWin(m);
        } else if (m.status == 1) {
            _msg('审核中')
        } else {
            openRZWin(m);
        }
    }
}

function openRZWin(data) {
    switch (data.name) {
        case 'real_auth':
            _url({
                url: 'frame4/authentication_frame',
                title: '身份认证'
            })
            break;
        case 'voice':
            _url({
                url: 'frame4/jiao_you_xuan_yan',
                title: '语音签名',
                types: data.types
            })
            break;
        case 'name_auth':
            _url({
                url: 'rz/rz_sfz',
                title: '实名认证',
                types: data.types
            })
            break;
        case 'education_auth':
            _url({
                url: 'rz/rz_edu',
                title: '学历认证',
                types: data.types
            })
            break;
        case 'car_auth':
            _url({
                url: 'rz/rz_car',
                title: '车辆认证',
                types: data.types
            })
            break;
        case 'house_auth':
            _url({
                url: 'rz/rz_house',
                title: '房产认证',
                types: data.types
            })
            break;
        case 'phone_auth':
            _url({
                url: 'frame4/bang_ding_shou_ji_frm',
                title: '手机认证',
                types: data.types
            })
            break;

        default:
            break;
    }
}

function openReadyRZWin(data) {
    switch (data.name) {
        case 'real_auth':
            _msg('您已完成身份认证');
            break;
        case 'voice':
            _url({
                url: 'frame4/user',
                title: '编辑资料',
                moreTitle: '保存'
            })
            break;
        case 'name_auth':
            _url({
                url: 'rz/ready_name',
                title: '实名认证'
            })
            break;
        case 'education_auth':
            _url({
                url: 'rz/ready_edu',
                title: '学历认证'
            })
            break;
        case 'car_auth':
            _url({
                url: 'rz/ready_car',
                title: '车辆认证'
            })
            break;
        case 'house_auth':
            _url({
                url: 'rz/ready_house',
                title: '房产认证'
            })
            break;
        case 'phone_auth':
            _url({
                url: 'rz/ready_phone',
                title: '手机认证'
            })
            break;
        default:
            break;
    }
}