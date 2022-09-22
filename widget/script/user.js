// 滚动选择
function myScroll(ziduan, type, title, arr) {
    var btnArr = [];
    if (type == 1) { // 单选 规则
        for (var i = arr[0]; i < arr[1]; i++) {
            var obj = {
                "name": i
            };
            btnArr.push(obj);
        }
    } else if (type == 2) { // 多选
        _url({
            url: 'user/user_filter',
            title: '选择',
            arr: _paramObj[ziduan],
            ziduan: ziduan,
            winName: 'frame4/user'
        })
        return;
    } else { // 单选 不规则
        btnArr = _paramObj[ziduan];
    }
    openUIActionSelector(btnArr, {
        col: 1,
        title: title
    }, function (ret, err) {
        if (ret.eventType == 'ok') {
            getUserFilter(ziduan, ret.level1)
        }
    })
}

// 修改
function getUserFilter(ziduan, value) {
    view.listData[ziduan] = value;
    if (ziduan == 'city') {
        view.listData.offten_city = value;
    }
}

function isRegisterUserName(s) {
    var patrn = /[^\w\.\/]/ig;
    if (patrn.exec(s)) return false
    return true;
}


// 修改头像
function changeHeader() {
    openPic(function (ret) {
        if (ret && ret.data) {
            view.head = ret.data;
        }
    })
}

// 修改
function newChange(fn, str) {
    console.log(str);
    // 选择常住城市
    if (fn == 'selectOfftenCity') {
        view.listData.offten_city = str;
        return;
    }
    // 选择交友节目
    if (fn == 'selectDyProgram') {
        view.listData.dy_program = str;
        return;
    }
    // 选择期望对象
    if (fn == 'selectDyConditions') {
        view.listData.dy_conditions = str;
        return;
    }
}