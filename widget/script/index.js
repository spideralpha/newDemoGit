var leftW;
var timer1;
var timeout;

// 霸屏广播滚动
function scrollLeft() {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        view.bapin = {};
    }, 30000);
    leftW = 0;
    clearInterval(timer1);
    timer1 = setInterval(function() {
        if (!view.bapin.user_id) {
            clearInterval(timer1);
            leftW = 0;
        }
        leftW--;
        if (leftW <= -$('.scrollbox').eq(0).width()) {
            leftW = $('.left').eq(0).width();
        }
        $('.scrollbox').eq(0).css('left', leftW + 'px');
    }, 20);
}
// 获取霸屏头条
function getBapin() {
    _ajax('api/Speaker/newest', function(ret, err) {
        if (ret && ret.code == 200) {
            // view.bapin = ret.data;
            // scrollLeft(); //霸屏头条滚动
            setTVScroll(ret.data)
        }
    })
}

function setTVScroll(data) {
    if (!data || !data.gift_cover) return;
    if ($api.getStorage('shang') == 1) return;
    console.log(JSON.stringify(data))
    var time = new Date();
    var hh = time.getHours();
    hh = hh < 10 ? '0' + hh : hh;
    var mm = time.getMinutes();
    mm = mm < 10 ? '0' + mm : mm;
    var tt = hh + ':' + mm;
    var cover = returnImg(data.gift_cover);

    // 背景
    var c = `<div class="tv-content">`;
    if (data.background) {
        var b = returnImg(data.background);
        c = `<div class="tv-content" style=" background-image: url('${b}')">`;
    }
    // 送礼人
    var u1 = `<span class="name" >${data.user_name}</span>`;
    if (data.user_id) {
        u1 = `<span class="name" onclick="go_userInfo(${data.user_id}, '${data.user_name}', '${data.user_sex}')">${data.user_name}</span>`;
    }
    // 收礼人
    var u2 = `<span class="name" >${data.another_name}</span>`;
    if (data.another_id) {
        u2 = `<span class="name" onclick="go_userInfo(${data.another_id}, '${data.another_name}', '${data.another_user_sex}')">${data.another_name}</span>`;
    }

    var html =
        `${c}
        <span class="time">${tt}</span> ${u1}送给${u2}${data.gift_num}个<span class="gift">[${data.gift_name}]</span><img src="${cover}" alt="">,掌声响起来...<span class="clap-icon"></span>
        <span class="up-btn" onclick="_url({url:'other/dianshi', title:'上电视'})"> 📺 如何上电视</span>
    </div>`;
    if ($('.tv-content').length > 1) {
        $('.tv-content').eq(0).remove();
    }
    $('.tv-content').eq(0).addClass('go');
    $('#tv').append(html);
}



// // 获取首页轮播
// function swiperLoad(callback) {
//     getSlide(1, function(data) {
//         view.lbList = data;
//         setTimeout(function() {
//             var mySwiper = new Swiper('.swiper-container', {
//                 loop: true,
//                 autoplay: {
//                     delay: 5000,
//                     stopOnLastSlide: false,
//                     disableOnInteraction: false,
//                 },
//             })
//             callback();
//         }, 300)
//     })
// }

// 经纬度获取
function getAddress() {
    var micResult = api.hasPermission({
        list: ['location']
    });
    var mapTime = new Date().getDate();
    if (!micResult[0].granted) {
        // 存在权限未开启的情况，1天仅请求一次
        if (mapTime == $api.getStorage('mapTime')) return;
        getPermission(['location'], function(code) {
            $api.setStorage('mapTime', mapTime);
            if (code != 0) {
                _msg('未获取定位授权')
            } else {
                _m()
            }
        })
    } else {
        _m()
    }

    function _m() {
        var mapTime = new Date().getHours();
        // 已开启定位权限 
        map.getLocation(function(ret, msg) {
            if (ret && ret.status) {
                // 有获取经纬度则需更新用户资料 
                updateUserAddress()
                if (!ret.isOld) {
                    // 经纬度与原经纬度相差较大 则需更新列表
                    _send('areaupdate')
                }
            } else if (!ret.status) {
                // GPS未开启的情况，1小时仅提示一次
                if (mapTime == $api.getStorage('gpsTime')) return;
                $api.setStorage('gpsTime', mapTime)
                if (msg) {
                    _msg(msg);
                }
            }
        })
    }
}
// 更新用户经纬度
function updateUserAddress() {
    if (!$api.getStorage('userid')) return;
    var lon = $api.getStorage('lon');
    var lat = $api.getStorage('lat');
    if (!lon || !lat) return;
    returnArea(lon, lat, function(reg) {
        if (reg.result && reg.result.addressComponent) {
            var data = reg.result.addressComponent;
            var city = data.city;
            $api.setStorage('appCity', {
                p: data.province,
                c: data.city,
                q: data.district
            }); // 设置app当前城市
            _ajax('api/user/editInfo', function(ret, err) {}, {
                user_id: $api.getStorage('userid'),
                city: city,
                offten_city: city,
                longitude: lon,
                latitude: lat,
            })
        }
    })
}

// 点击分类栏目时，设置 frame 组当前可见 frame
function randomSwitchBtn(index, gName) {
    active(index, '.' + gName + ' .list'); // cls 使用与组名一致，便于复用
    var reload = gName == 'tri' ? false : true;
    api.setFrameGroupIndex({
        name: gName,
        index: index,
        scroll: true, //是否平滑滚动至目标窗口，即是否带有动画
        reload: false, // 刷新
    });
}
// 切换
function changeFrame(index) {
    var h = $api.offset($api.dom('header')).h;
    var fh = $api.offset($api.dom('footer')).h;
    var oneName = 'one2';
    var fArr = [];
    var pageParam = [];
    for (var i = 0; i < 2; i++) {
        fArr.push('frame0');
        var obj = {
            index: i,
        }
        pageParam.push(obj);
    }
    groupInit(oneName, fArr, h, fh, 0, '.' + oneName + ' .list', pageParam, {});
    randomSwitchBtn(0, oneName);
}



// // 设置上线优先
// function onlineFirst() {
//     var status = $api.getStorage('online');
//     var online = status == 1 ? 0 : 1;
//     $api.setStorage('online', online)
//     if (online == 1) {
//         $('.online-tag').addClass('active');
//     } else {
//         $('.online-tag').removeClass('active');
//     }
//     _send('onlineFirst');
// }


// 打开速配
function openSP(type) {
    var _user = $api.getStorage('user');
    var txt = type == 2 ? '视频速配' : '语音速配';
    var content = `需真人认证后才能进入${txt}!`;
    if (_user.is_identity_authentication != 2 && _user.sex == '女') {
        openRZ(content);
        return
    }

    if (type == 2 && _user.sex == '男') {
        _ajax('api/user/userVolley', function(ret, err) {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
            if (ret && ret.code == 200) {
                if (ret.volley < 100) {
                    showDetail('modal/chongzhi_modal')
                }else{
                    _url({
                        type: type,
                        slidBackEnabled: 0
                    }, 'frame0/supei')
                }
            }
        }, {
            user_id: $api.getStorage('userid'),
        })
    } else {
        _url({
            type: type,
            slidBackEnabled: 0
        }, 'frame0/supei')
    }
}

// 霸屏修改高度
function changeBaPin() {
    var h = $api.offset($api.dom('header')).h;
    api.setFrameGroupAttr({
        name: 'one2',
        rect: {
            y: h, //左上角y坐标
        }
    });
}