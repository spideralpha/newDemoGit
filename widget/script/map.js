var Map = function() {
    var bMap = api.require('bMap');
    var _this = this;
    _this.init = function() {
        // bmap 1.5版本及以后 安卓需调用bMap.setAgreePrivacy 同意协议
        if (api.systemType != 'ios' && bMap.setAgreePrivacy) {
            bMap.setAgreePrivacy({
                agree: true
            });
        }
        // bmap 1.5版本及以后 安卓允许初始化 , 1.5以前无需初始化. IOS一直需初始化
        if (bMap.initMapSDK) {
            bMap.initMapSDK(function(ret, err) {
                console.log(JSON.stringify(ret))
                console.log(JSON.stringify(err))
                if (ret.status) {}
            });
        }
    }
    _this.init();
    _this.hide = function() {
        bMap.hide();
    }
    _this.show = function() {
        bMap.show();
    }
    // 判断服务是否开启
    _this.service = function(callback) {
        bMap.getLocationServices(function(ret, err) {
            if (typeof callback == 'function') {
                if (ret.enable) {
                    if (api.systemType == 'ios' && ret.authorizationStatus == 'denied') {
                        // ios 永不允许
                        callback(400, '未获取定位授权')
                    } else {
                        // 服务已开启 可尝试请求定位权限
                        callback(200)
                    }
                } else {
                    var m = api.systemType == 'ios' ? '请先将隐私->定位服务开启' : '请先开启GPS';
                    callback(500, m)
                }
            }
        });
    }
    // 判断权限是否开启
    _this.judge = function(callback) {
        _this.service(function(code, msg) {
            if (code != 200) {
                callback(code, msg)
            } else {
                getPermission(['location'], function(code) {
                    if (code != 0) {
                        callback(400, '未获取定位授权')
                    } else {
                        callback(200)
                    }
                })
            }
        })

    }

    // 获取当前经纬度 
    _this.getLocation = function(callback) {
        _this.judge(function(code, msg) {
            if (code != 200) {
                var result = {
                    status: false,
                    lon: $api.getStorage('lon'),
                    lat: $api.getStorage('lat'),
                    isOld: 1,
                };
                // _msg(msg || '未开启定位');
                callback(result, msg);
                return;
            }
            bMap.getLocation({
                accuracy: '10m',
                autoStop: true,
                filter: 1
            }, function(ret) {
                ret.isOld = 1;
                if (ret && ret.status) {
                    if (ret.lon - $api.getStorage('lon') > 0.001) {
                        ret.isOld = 0;
                    }
                    if (ret.lat - $api.getStorage('lat') > 0.001) {
                        ret.isOld = 0;
                    }
                    $api.setStorage('lon', ret.lon);
                    $api.setStorage('lat', ret.lat);
                }
                callback(ret)
            });
        })

    }

    // 通过经纬度获取当前地址
    _this.getAddress = function(lon, lat, callback) {
        bMap.getNameFromCoords({
            lon: Number(lon),
            lat: Number(lat)
        }, function(ret, err) {
            console.log(JSON.stringify(ret))
            console.log(JSON.stringify(err))
            callback(ret, err);
        });
    }


    // 根据单个关键字搜索兴趣点
    _this.search = function(kw, city, index, callback) {
        bMap.searchInCity({
            city: city,
            keyword: kw,
            pageIndex: index,
            pageCapacity: 20
        }, function(ret, err) {
            if (ret && typeof callback == 'function') {
                callback(ret);
            }
        });
    }
    _this.searchN = function(data, cb) {
        var kw = data.kw;
        if (kw && kw.indexOf('市') != -1) {
            _this.inCity(data, cb)
        } else {
            _this.near(data, cb)
        }
    }
    // 指定城市
    _this.inCity = function(data, cb) {
        var kw = data.kw;
        var c = kw.split('市');
        bMap.searchInCity({
            city: c[0],
            keyword: c[1],
            pageIndex: data.page || 0,
            pageCapacity: 20
        }, function(ret, err) {
            console.log(JSON.stringify(ret))
            console.log(JSON.stringify(err))
            if (ret && ret.status) {
                cb(ret.results);
            } else {
                _this.near(data, cb);
            }
        });
    }

    // 附近搜索
    _this.near = function(data, cb) {
        bMap.searchNearby({
            keyword: kw,
            lon: data.lon || $api.getStorage('lon'),
            lat: data.lat || $api.getStorage('lat'),
            radius: 10000000, // 单位:米
            pageIndex: data.page || 0,
            pageCapacity: 20
        }, function(ret, err) {
            console.log(JSON.stringify(ret))
            console.log(JSON.stringify(err))
            if (ret && ret.status) {
                cb(ret.results);
            } else {
                cb([])
            }
        })
    }
    // 推荐搜索关键字
    _this.tuijian = function(kw, city, callback) {
        bMap.autocomplete({
            keyword: kw,
            city: city
        }, function(ret) {
            if (ret && typeof callback == 'function') {
                callback(ret);
            }
        });
    }

    // 打开百度地图
    _this.open = function(data, callback) {
        var lon = data.lon || $api.getStorage('lon');
        var lat = data.lat || $api.getStorage('lat');
        bMap.open({
            rect: {
                x: data.x || 0,
                y: data.y || 0,
                w: data.w || api.frameWidth,
                h: data.h || api.frameHeight
            },
            center: {
                lon: lon,
                lat: lat
            },
            zoomLevel: 18,
            showUserLocation: true,
            fixedOn: api.frameName,
            fixed: true
        }, function(ret, err) {
            console.log(JSON.stringify(ret))
            console.log(JSON.stringify(err))
            if (typeof callback == 'function') {
                callback();
            }
        });
    }

    _this.point = function(data) {
        bMap.addAnnotations({
            annotations: [{
                id: 1,
                lon: data.lon,
                lat: data.lat
                // }, {
                //     id: 2,
                //     lon: 116.29,
                //     lat: 40.109
                // }, {
                //     id: 3,
                //     lon: 116.298,
                //     lat: 40.11
            }],
            draggable: true
        }, function(ret) {
            // if (ret) {
            //     alert(ret.id);
            // }
        });
    }
}


function returnArea(lon, lat, callback) {
    var mm = new Map();
    mm.getAddress(lon, lat, function(ret, err) {
        if (ret && ret.status) {
            var data = ret;
            if (data.province) {
                data.province = data.province.replace('省', '');
                data.province = data.province.replace('市', '');
            }
            if (data.city) {
                data.city = data.city.replace('市', '');
            }
            if (data.district) {
                data.district = data.district.replace('区', '');
                data.district = data.district.replace('县', '');
            }
            if (!data.city) {
                data.city = data.district;
            }
            if (!data.city) {
                data.city = data.province;
            }
            var obj = {
                status: 0,
                result: {
                    addressComponent: data
                }
            }
            callback(obj, err);
        } else {
            // 若app配置失效 则使用web配置
            var ak = '1lZ7bQPERDmaxOxNcGOn9hRSqfceDn6y';
            var url = 'http://api.map.baidu.com/reverse_geocoding/v3/?ak=' + ak + '&output=json&coordtype=wgs84ll&location=' + lat + ',' + lon;
            console.log(url)
            api.ajax({
                url: url,
                method: 'get',
                cache: true,
            }, function(ret, err) {
                console.log(JSON.stringify(ret))
                console.log(JSON.stringify(err))
                if (ret && ret.result && ret.result.addressComponent) {
                    var data = ret.result.addressComponent;
                    if (data.province) {
                        data.province = data.province.replace('省', '');
                        data.province = data.province.replace('市', '');
                    }
                    if (data.city) {
                        data.city = data.city.replace('市', '');
                    }
                    if (data.district) {
                        data.district = data.district.replace('区', '');
                        data.district = data.district.replace('县', '');
                    }
                    if (!data.city) {
                        data.city = data.district;
                    }
                    if (!data.city) {
                        data.city = data.province;
                    }
                    ret.result.addressComponent = data;
                }
                callback(ret, err);
            });
        }
    })
}



// 更新用户经纬度
function updateUserAddress(lon, lat) {
    if (!$api.getStorage('userid')) return;
    if (!lon) {
        lon = $api.getStorage('lon');
    }
    if (!lat) {
        lat = $api.getStorage('lat');
    }
    if (!lon || !lat) return;
    _ajax('Home/User/setJW', function(rets, errs) {
        console.log(JSON.stringify(rets))
        console.log(JSON.stringify(errs))
    }, {
        userid: $api.getStorage('userid'),
        longitude: lon,
        latitude: lat,
    })
    returnArea(lon, lat, function(reg) {
        if (reg.result && reg.result.addressComponent) {
            var data = reg.result.addressComponent;
            var city = data.city;
            _ajax('api/user/editInfo', function(ret, err) {
                console.log(JSON.stringify(ret))
                console.log(JSON.stringify(err))
            }, {
                user_id: $api.getStorage('userid'),
                city: city,
                offten_city: city,
            })
        }
    })
}