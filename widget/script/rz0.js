var imagesI = 1;
// 图片处理
function dealImg(img, callback) {
    var imageFilter = api.require('imageFilter');
    imageFilter.getAttr({
        path: img
    }, function (ret, err) {
        if (ret.status) {
            console.log(JSON.stringify(ret));
            if (ret.width > 3000 || ret.height > 3000 || ret.size / 1024 / 1024 > 3) {
                imgCompress(img, callback);
            } else {
                callback(img);
            }
        } else {
            _alert(JSON.stringify(err));
        }
    });
}

// 图片压缩
function imgCompress(img, callback) {
    var imageFilter = api.require('imageFilter');
    imageFilter.compress({
        img: img,
        isClarityimg: false,
        quality: 0.5,
        scale: 0.5,
        save: {
            imgPath: '/storage/emulated/0/csUpload',
            imgName: imagesI + '.jpg'
        },
    }, function (rets, errs) {
        if (rets.status) {
            var path = '/storage/emulated/0/csUpload/' + imagesI + '.jpg';
            dealImg(path, callback)
        } else {
            alert(JSON.stringify(errs));
        }
    });
}


// 打开人脸识别
function jiaoyan(url, callback) {
    console.log(url)
    // _loading('请稍后');
    _ajaxFile('api/Faceid/get_biz_token', function (ret, err) {
        console.log(JSON.stringify(ret))
        console.log(JSON.stringify(err))
        if (ret && ret.code == 200) {
            if (typeof callback == 'function') {
                callback(ret.data);
            }
        } else {
            // _loadingClose();
            // _alert('相关数据错误');
            _alert(ret.msg);
        }
    }, {
        user_id: $api.getStorage('userid'),
    }, {
        image_ref1: url
    })
}


// 调起faceid
function showFace(bizToken, callback) {
    console.log(bizToken)
    var UIFaceID = api.require('UIFaceID');
    UIFaceID.openFaceID({
        bizToken: bizToken,
    }, function (rets, errs) {
        console.log(JSON.stringify(rets))
        console.log(JSON.stringify(errs))
        _ajax('api/Faceid/auth', function (retg, errg) {
            console.log(JSON.stringify(retg))
            console.log(JSON.stringify(errg))
            _loadingClose();
            if (retg.code == 200) {
                // pushImg(url);
                _alert('验证成功', function () {
                    if (typeof callback == 'function') {
                        callback(200)
                    }
                });
            } else {
                _alert('验证失败');
                if (typeof callback == 'function') {
                    callback(400)
                }
            }
        }, {
            user_id: $api.getStorage('userid')
        });
    });
}