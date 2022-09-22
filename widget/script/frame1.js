// 举报
function more(index) {
    var data = view.ffList[index];
    var uid = data.id;
    var dyid = data.dy_id;
    var buttons = uid != $api.getStorage('userid') ? ['举报'] : ['删除'];
    // var buttons = ['举报'];
    _action('', buttons, function(bIndex) {
        if (bIndex != buttons.length + 1) {
            if (uid != $api.getStorage('userid')) {
                _url({
                    url: 'frame0/ju_bao_frame',
                    title: '匿名举报',
                    uid: uid
                })
            } else {
                _ajax('api/Member/delDymanic', function(ret, err) {
                    console.log(JSON.stringify(ret))
                    console.log(JSON.stringify(err))
                    _msg(ret.msg);
                    if (ret && ret.code == 200) {
                        view.ffList.splice(index, 1);
                    }
                }, {
                    id: dyid
                })
            }
        }
    })
}

// 报名
function joinEnroll(id, index) {
    var status = view.ffList[index].self_enroll;
    var url = status == 0 ? 'home/Dymanic/enroll' : 'home/Dymanic/cancelenroll';
    _loading();
    _ajax(url, function(ret, err) {
        console.log(JSON.stringify(ret))
        _loadingClose();
        if (ret) {
            _msg(ret.msg);
            if (ret.code == 200) {
                view.ffList[index].self_enroll = status == 0 ? 1 : 0;
                view.ffList[index].enroll = status == 0 ? parseInt(view.ffList[index].enroll) + 1 : view.ffList[index].enroll - 1;
                pushMsg(view.ffList[index].id);
            } else if (ret.code == 220) {
                if (ret.msg == '开通会员后才能报名') {
                    openVIP();
                }
            }
        }
    }, {
        user_id: $api.getStorage('userid'),
        dy_id: id,
    })
}

// 点赞
function zan(id, index, type) {
    var status = view.ffList[index].isthumbsup;
    _ajax('home/Dymanic/thumbsup', function(ret, err) {
        console.log(JSON.stringify(ret))
        console.log(JSON.stringify(err))
        if (ret) {
            _msg(ret.msg);
            if (ret.code == 200) {
                view.ffList[index].isthumbsup = status == 0 ? 1 : 0;
                view.ffList[index].num = status == 0 ? parseInt(view.ffList[index].num) + 1 : view.ffList[index].num - 1;
                pushMsg(view.ffList[index].id);
            }
        }
    }, {
        type: parseInt(status) + 1,
        dy_id: id,
        userid: $api.getStorage('userid'),
    })
}

// 添加评论
function addComment(dy_id, uid) {
    $('.input-bg').removeClass('new-hide');
    view.inputObj = {
        id: dy_id,
        uid: uid
    };
    $('.input-bg input').focus();
}

// 发布评论
function send() {
    var val = $.trim($('.input-wrap input').val());
    if (!val) {
        _msg('评论不能为空');
        return;
    }
    _ajax('home/Dymanic/comment', function(ret, err) {
        console.log(JSON.stringify(ret))
        console.log(JSON.stringify(err))
        if (ret) {
            _msg(ret.msg);
            if (ret.code == 200) {
                $('.input-wrap input').val('');
                $('.input-bg').addClass('new-hide');
            }
        }
    }, {
        dy_id: view.inputObj.id,
        userid: $api.getStorage('userid'),
        touserid: view.inputObj.uid,
        type: 0, //0为评论，1为回复
        content: val,
    })
}


// 心动
function _dashan(index) {
    var uid = view.ffList[index].id;
    var name = view.ffList[index].name;
    // _url({
    //     touserid: uid,
    //     title: '与' + name + '的聊天',
    //     moreType: 1
    // }, 'frame0/liaotian_win')
    if (view.ffList[index].dashan == 1) return;
    _ajax('api/privatechat/greet', function(ret, err) {
        _msg(ret.msg);
        if (ret && ret.code == 200) {
            view.ffList[index].dashan = 1;
            view.$forceUpdate();
            // $(obj).addClass('hi-tags');
        }
    }, {
        user_id: $api.getStorage('userid'),
        id: uid,
    })
}

// 分享动态
function shareDY(data) {
    var buttons = [escape_w, '朋友圈'];
    _action('', buttons, function(bIndex) {
        if (bIndex != buttons.length + 1) {
            if (data.sumbImage.length > 0) {
                var img = returnImg(data.sumbImage[0]);
                imgCache(img, function(thumb) {
                    _loadingClose();
                    var obj = {
                        title: data.name + '发表了最新动态，欢迎围观',
                        description: '想脱单，用小火苗',
                        thumb: thumb,
                        url: share_url + '?yq=' + $api.getStorage('userid')
                    }
                    if (bIndex < 3) {
                        var arr = ['session', 'timeline'];
                        obj.type = arr[bIndex - 1];
                        shareWX(obj);
                    } else if (bIndex < 5) {
                        var arr = ['QFriend', 'QZone'];
                        obj.type = arr[bIndex - 1];
                        shareQQ(obj);
                    }

                })
            } else {
                var obj = {
                    title: data.name + '发表了最新动态，欢迎围观',
                    description: '想脱单，用小火苗',
                    thumb: 'widget://image/share_logo.png',
                    url: share_url + '?yq=' + $api.getStorage('userid')
                }
                if (bIndex < 3) {
                    var arr = ['session', 'timeline'];
                    obj.type = arr[bIndex - 1];
                    shareWX(obj);
                } else if (bIndex < 5) {
                    var arr = ['QFriend', 'QZone'];
                    obj.type = arr[bIndex - 1];
                    shareQQ(obj);
                }
            }
        }
    })

}


function imgCache(img, callback) {
    api.imageCache({
        url: img
    }, function(ret, err) {
        console.log(JSON.stringify(ret))
        console.log(JSON.stringify(err))
        if (ret && ret.url) {
            dealImg(ret.url, callback)
        } else {
            callback('widget://image/share_logo.png');
        }
    });
}

// 图片处理
function dealImg(img, callback) {
    var imageFilter = api.require('imageFilter');
    imageFilter.getAttr({
        path: img
    }, function(ret, err) {
        if (ret.status) {
            console.log('====图片信息====')
            console.log(JSON.stringify(ret));
            if (ret.size / 1024 > 30) {
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
    var imgName = new Date().getTime();
    imageFilter.compress({
        img: img,
        isClarityimg: false,
        quality: 0.5,
        scale: 0.5,
        // size: {
        //     w: 2500,
        //     h: 2500
        // }

        save: {
            imgPath: api.cacheDir,
            imgName: imgName + '.png'
        },
    }, function(rets, errs) {
        console.log('====压缩后的信息====')
        console.log(JSON.stringify(rets));

        console.log(api.cacheDir + '/' + imgName + '.png');
        if (rets.status) {
            var path = api.cacheDir + '/' + imgName + '.png';
            dealImg(path, callback)
        } else {
            alert(JSON.stringify(errs));
        }
    });
}


function shareWX(data) {
    var weiXin = api.require('wxPlus');
    weiXin.shareWebpage({
        scene: data.type,
        title: data.title,
        description: data.description,
        thumb: data.thumb,
        contentUrl: data.url,
    }, function(ret, err) {
        _msg('分享成功');
    });
}

// QZone QFriend
function shareQQ(data) {
    var obj = api.require('QQPlus');
    var dd = (data.description || '').replace(/<\/?.+?>/g, "");
    var dds = dd.replace(/ /g, '');
    var ddn = dds.replace(/&nbsp;/ig, ""); //ddn为得到后的内容
    obj.shareNews({
        url: data.url,
        title: data.title,
        description: ddn,
        imgUrl: data.img,
        type: type,
    }, function(ret, err) {
        if (ret.status) {
            _msg('分享成功');
        } else {
            _msg('分享失败');
        }
    });
}