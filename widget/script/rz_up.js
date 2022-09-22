// 选择图片
function selectFile() {
    openPic(function (ret) {
        if (ret && ret.data) {
            view.imgList.push(ret.data);
        }
    })
}

// 删除图片
function delImg(index) {
    view.imgList.splice(index, 1);
}

// 发布 1房屋|2学历|3车辆
function submit(types) {
    // if (types != 4 && types != 5) {
    //     if (!view.number) {
    //         _msg('请输入相关证件编号');
    //         return;
    //     }
    // }
    if (view.imgList.length == 0) {
        _msg('请上传相关证件图片');
        return;
    }
    if (view.imgList.length != 2) {
        _msg('请至少上传两张证件图片');
        return;
    }
    _loading();
    _upImgs({
        image: view.imgList
    }, function (u) {
        var arr = u.split(',');
        _ajax('api/auth/certification', function (ret, err) {
            console.log(JSON.stringify(ret))
            console.log(JSON.stringify(err))
            _loadingClose();
            _msg(ret.msg);
            if (ret && ret.code == 200) {
                timerWin('', 'member_win');
            }
        }, {
            user_id: $api.getStorage('userid'),
            types: api.pageParam['types'],
            image_front: arr[0],
            image_behind: arr[1]
            // numbers: view.number,
        })
    })
}