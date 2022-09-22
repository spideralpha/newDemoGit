// 选择
function selectFilter(ziduan) {
    var title = '';
    switch (ziduan) {
        case 'age':
            btnArr = _paramObj.age;
            title = '年龄'
            break;
        case 'stature':
            btnArr = _paramObj.stature;
            title = '身高'
            break;
        case 'emotion':
            btnArr = _paramObj.emotion;
            title = '情感状态'
            break;
        case 'education_background':
            btnArr = _paramObj.education_background;
            title = '学历'
            break;
        case 'monthly_salary':
            btnArr = _paramObj.monthly_salary;
            title = '薪资'
            break;
        default:
            break;
    }
    openUIActionSelector(btnArr, {
        col: 1,
        title: title
    }, function (ret, err) {
        console.log(JSON.stringify(ret))
        if (ret.eventType == 'ok') {
            var info = ret.selectedInfo[0];
            getUserFilter(ziduan, info.name);
        }
    })
}

// 处理间隔数据 传入数据如：300,500 返回300-500
function dealUserData(str, danwei) {
    if (!str) {
        return str;
    }
    danwei = danwei ? danwei : '';
    if (str.indexOf(',') == -1) {
        // 以上
        return str + danwei + '以上';
    } else {
        var arr = str.split(',');
        if (arr[0] == 0) {
            // 以下
            return arr[1] + danwei + '以下';
        } else {
            return arr.join('-') + danwei;
        }
    }
}
// 与以上函数为逆操作 传入数据如：300-500 返回300,500
function returnUserData(str, danwei) {
    if (!str) {
        return str;
    }
    danwei = danwei ? danwei : '';
    str = str.replace(danwei, '');
    if (str.indexOf('以上') != -1) {
        str = str.replace('以上', '');
        return str;
    }
    if (str.indexOf('以下') != -1) {
        str = str.replace('以下', '');
        return 0 + ',' + str;
    }
    var arr = str.split('-');
    return arr.join(',');
}