// 获取用户相册
function getUserPhoto(callback, data) {
    var uid = $api.getStorage('userid');
    if (data && data.uid) {
        var uid = data.uid;
    }
    var touid = $api.getStorage('userid');
    if (data && data.touid) {
        var touid = data.touid;
    }
    var slide = 0;
    if (data && data.slide) {
        var slide = data.slide;
    }

    _ajax('api/Userimg/lists', function(ret, err) {
        console.log(JSON.stringify(ret));
        console.log(JSON.stringify(err));
        if (ret && ret.code == 200) {
            if (typeof callback == 'function') {
                var arr = [];
                var num = 0;
                // 图片包含number字段 用以标识 查看大图时的索引
                for (var i = 0, len = ret.result.length; i < len; i++) {
                    if (ret.result[i].types == 1) {
                        ret.result[i].number = num;
                        arr.push(ret.result[i]);
                        num++;
                    }
                }
                if (typeof callback == 'function') {
                    callback(ret.result, arr);
                }
            }
        }
    }, {
        user_id: uid, // 相册拥有者
        to_user: touid,
        slide: slide
    })
}

// 选择资源类型
function selectPic() {
    var buttons = ['图片', '视频'];
    _action('选择上传类型', buttons, function(bIndex) {
        if (bIndex != buttons.length + 1) {
            setPicLimit(bIndex);
        }
    })
}

// 设置图片阅览权限
function setPicLimit(type) {
    var title = type == 1 ? '图片' : '视频';
    if ($api.getStorage('sex') == '男') {
        var buttons = ['公开（推荐）', '阅后即焚（查看2秒后焚毁）'];
    } else {
        var buttons = ['公开（推荐）', '阅后即焚（查看2秒后焚毁）', '红包' + title, '阅后即焚的红包' + title];
    }

    _action('该' + title + '阅览权限', buttons, function(bIndex) {
        if (bIndex != buttons.length + 1) {
            var burn = (bIndex == 2 || bIndex == 4) ? 1 : 0;
            if (bIndex > 2) {
                // 需设置红包价格
                setPicPrice(type, burn);
            } else {
                getPic(type, burn, 0)
            }
        }
    })
}

// 设置红包金额
function setPicPrice(type, burn) {
    api.prompt({
        title: '请输入金额',
        type: 'number',
        buttons: ['取消', '确定'],
        msg: '设置红包金额',
    }, function(ret, err) {
        if (ret.buttonIndex == 2) {
            getPic(type, burn, ret.text);
        }
    });
}

// 1 图片 2 视频
function getPic(type, burn, packet) {
    var media = type == 1 ? 'pic' : 'video';
    openPic(function(ret) {
        _loading();
        if (media == 'video') {
            // 获取视频封面
            getVideoCover(ret.data, function(image) {
                pushVideo(ret.data, function(v) {
                    _upImg({
                        image: image
                    }, function(u) {
                        submitPhoto(burn, packet, v, u);
                    })
                })
            })
            return;
        }
        _upImg({
            image: ret.data
        }, function(u) {
            submitPhoto(burn, packet, u);
        })
    }, media);
}


// 上传
function submitPhoto(burn, packet, url, cover) {
    var obj = {
        user_id: $api.getStorage('userid'),
        burn: burn,
        packet: packet,
        types: 1, // 1 图片 2视频
        photo_album: url
    }
    // 有封面的为视频
    if (cover) {
        obj.cover = cover;
        obj.types = 2;
    }
    _ajax('api/upload/upload', function(rets, errs) {
        _loadingClose();
        var msg = rets.msg;
        _msg(msg);
        if (rets && rets.code == 200) {
            getUserPhoto(function(all, imgArr) {
                view.imgList = all;
                view.imgArr = imgArr;
            })
        }
    }, obj)
}

//一键恢复
function clear_hurn() {
    _ajax('Home/User/resetburn', function(ret, err) {
        var msg = ret.code == 200 ? '恢复成功' : ret.msg;
        _msg(msg);
    }, {
        user_id: $api.getStorage('userid'),
    })
}
var vvTime;
// 播放音频
function playVoice() {
    clearTimeout(vvTime);
    if (view.vplay == 0) {
        view.vplay = 1;
        audio.play({
            url: returnImg(view.data.voice)
        }, function(ret) {
            // console.log(JSON.stringify(ret))
            if (ret && ret.duration) {
                vvTime = setTimeout(function() {
                    view.vplay = 0;
                    audio.stop();
                }, (ret.duration + 2) * 1000)
            }
        })
    } else {
        view.vplay = 0;
        audio.stop();
    }
}

// 获取认证情况
function getRZ(uid) {
    _ajax('api/auth/lists', function(ret, err) {
        if (ret && ret.code == 200) {
            var obj = {};
            for (var i = 0, len = ret.data.length; i < len; i++) {
                obj[ret.data[i].name] = ret.data[i];
            }
            view.rzInfo = obj;
        }
    }, {
        user_id: uid
    })
}


// 获取动态列表
function getDY(page) {
    var param = {
        userid: $api.getStorage('userid'),
        to_user: view.touserid,
        type: 0,
        page: page
    }
    _ajax('home/Dymanic/otherlist', function(ret, err) {
        if (ret && ret.code == 200) {
            if (page == 0) {
                view.dyList = [];
            }
            var data = ret.result;
            if (data && data.length > 0) {
                var arr = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].sumbImage && data[i].sumbImage[0]) {
                        arr.push(data[i].sumbImage[0]);
                    } else if (data[i].cover) {
                        arr.push(data[i].cover)
                    }
                }
                view.dyList = view.dyList.concat(arr);
                console.log(JSON.stringify(view.dyList))
            }
        }
    }, param)
}

// 获取用户信息
function getInfo() {
    _getUser(function(ret) {
        $('.loading-bg').remove();
        if (view.touserid != view.myuserid && ret.result.pull_black == 1) {
            $('.loading-bg').remove();
            _alert('对方已拉黑您', function() {
                api.closeWin();
            })
            return;
        }
        view.data = ret.result;
        getYSConfig();
        getMyCar();
        getRZ(view.touserid);

        if (view.touserid != view.myuserid && view.data.voice) {
            playVoice();
        }
        if (view.data.photo_show && view.data.photo_show.length > 0) {
            var photo = JSON.parse(JSON.stringify(view.data.photo_show));
            // photo.pop(); // 移除最后一张[头像] 
            photo.shift(); // 移除第一张[头像] 
            view.photo = photo;
            setTimeout(function() {
                var mySwiper = new Swiper('.swiper-container', {
                    loop: true,
                    autoplay: {
                        delay: 5000,
                        stopOnLastSlide: false,
                        disableOnInteraction: false,
                    },
                });
            }, 500)
        }

        if (view.touserid != view.myuserid) {
            _getUser(function(ret) {
                console.log(JSON.stringify(ret))
                view.myInfo = ret.result;
            })
        }
    }, view.touserid, 1)
}

// 获取隐私设置
function getYSConfig() {
    _ajax('api/personal/config', function(ret, err) {
        if (ret && ret.code == 200 && ret.data) {
            view.configInfo = ret.data;
        }
    }, {
        user_id: view.touserid
    })
}

// 获取ta的座驾
function getMyCar() {
    _ajax('api/car/myCar', function(ret, err) {
        if (ret && ret.code == 200) {
            if (ret.data && ret.data[0]) {
                view.car = ret.data[0]['cover'];
            }
        }
    }, {
        user_id: view.touserid
    })
}



function topNavScroll() {
    //获取当前窗口滚动条顶部所在的像素值 并取整
    var topScroll = Math.floor($(window).scrollTop());
    //设置滚动多少像素后透明度变为1
    // var scrollDist = api.winWidth;
    // var scrollDist = window.innerWidth;
    var scrollDist = 80;
    //定义滚动条在向下滚动180像素后 变成完全不透明
    // console.log(topScroll / scrollDist)
    if (topScroll <= scrollDist) {
        //通过浏览器标题栏显示并检查数据
        //document.title = topScroll + '-' + opacity;
        //计算当前透明度 当前所在的像素 除 180(topScroll的最大值 因为透明度的值是0-1之间的小数)
        // $('#fx-header').css('background','rgba(255,255,255,'+ topScroll / scrollDist+')');
        $('#fx-header .aui-iconfont').css('color', '#fff');
        $('#fx-header').css('background', 'rgba(255,255,255, ' + topScroll / scrollDist + ')');
        $('#fx-header .title').css('opacity', topScroll / scrollDist);
        $('#fx-header .edit-icon').removeClass('edits-icon');
    } else {
        $('#fx-header').css('background', 'rgba(255,255,255, 1)');
        $('#fx-header  .title').css('opacity', 1);
        $('#fx-header .aui-iconfont').css('color', '#000');
        $('#fx-header .edit-icon').addClass('edits-icon');
    }
}