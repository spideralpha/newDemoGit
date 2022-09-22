// 版本更新
function updateVision(type, callback) {
    if ($api.getStorage('shang') == 1) {
        judgeAgreement();
        return;
    }
    var upType = 0;
    _ajax('api/member/config', function(ret, err) {
        var version = api.appVersion;
        console.log(version)
        if (ret.code == 200) {
            var data = ret.data;
            if (api.systemType == 'ios' && versionCompare(version, data.appnum)) {
                upType = 1;
                showDetail('up_modal', {
                    appurl: data.appurl,
                    must: data.applesw,
                    type: type
                })
            } else if (api.systemType != 'ios' && versionCompare(version, data.anzhuonum)) {
                upType = 1;
                showDetail('up_modal', {
                    appurl: data.anzhuourl,
                    must: data.adsw,
                    type: type
                })
            } else {
                if (type == 1) {
                    _msg('当前已是最新版本')
                } else {
                    judgeAgreement();
                }
            }
        } else {
            judgeAgreement();
        }
        if (typeof callback == 'function') {
            callback(upType);
        }
    })
}
// v1 手机版本号， v2 服务器版本号
function versionCompare(v1, v2) {
    //去掉收尾空格
    v1 = v1.replace(/(^\s+)|(\s+$)/gi, "");
    v2 = v2.replace(/(^\s+)|(\s+$)/gi, "");
    //空检查
    if (!v1 || !v2) {
        return;
    }
    var arr = v1.split('.');
    var brr = v2.split('.');
    // 遍历 补全
    function bu(arr) {
        for (var i = 0; i < 3; i++) {
            if (!arr[i]) {
                arr[i] = 0;
            }
        }
    }
    bu(arr);
    bu(brr);
    console.log(arr);
    console.log(brr);
    var ver0 = parseInt(brr[0]) - parseInt(arr[0]);
    var ver1 = parseInt(brr[1]) - parseInt(arr[1]);
    var ver2 = parseInt(brr[2]) - parseInt(arr[2]);
    if (ver0 > 0) {
        return true;
    } else if (ver0 == 0 && (ver1 > 0 || (ver1 == 0 && ver2 > 0))) {
        return true;
    } else {
        return false;
    }
}

//打开进度条模块
function openUIActionProgress(url, must) {
    var UIActionProgress = api.require('UIActionProgress');
    UIActionProgress.open({
        maskBg: 'rgba(0,0,0,0.4)',
        styles: {
            h: 108,
            bg: '#fff',
            title: {
                size: 14,
                color: '#000',
                marginT: 10
            },
            msg: {
                size: 12,
                color: '#666',
                marginT: 5
            },
            lable: {
                size: 12,
                color: '#696969',
                marginB: 5
            },
            progressBar: {
                size: 4,
                normal: '#ccc',
                active: '#000000',
                marginB: 15,
                margin: 5
            }
        },
        data: {
            title: '正在连接服务器...',
            value: 0
        }
    }, function(ret) {
        console.log(JSON.stringify(ret))
        if (ret.eventType == 'show') {
            //这里应该是调用api.download去下载一个文件，然后根据api.download中的回调下载进度去修改模块参数；
            //由于是示例代码，使用setInterval来模拟下载进度变化。
            //循环调用
            console.log(url)
            api.download({
                // url: ret.anzhuo.anzhuourl,
                url: url,
                report: true,
                allowResume: true
            }, function(retg, errg) {

                console.log(JSON.stringify(retg))
                console.log(JSON.stringify(errg))
                if (retg && 0 == retg.state) {
                    setData(retg.percent);
                }
                if (retg && 1 == retg.state) {
                    /* 下载完成 */
                    var savePath = retg.savePath;
                    api.installApp({
                        appUri: savePath
                    });
                }
                if (retg.msg) {
                    alert(retg.msg);
                    closeUIActionProgress();
                    if (must == 1) {
                        api.closeWidget({
                            silent: true
                        });
                    }
                }
            });
        }
    });
};
//修改参数
function setData(value) {
    var UIActionProgress = api.require('UIActionProgress');
    if (value == 100) {
        UIActionProgress.setData({
            data: {
                title: '下载完成',
                msg: '',
                value: value
            }
        });
        setTimeout(function() {
            //关闭进度条模块
            closeUIActionProgress();
        }, 300);
    } else {
        //修改进度条参数
        UIActionProgress.setData({
            data: {
                title: '下载中...',
                msg: '',
                value: value
            }
        });
    }
};
//关闭模块
function closeUIActionProgress() {
    var UIActionProgress = api.require('UIActionProgress');
    UIActionProgress.close();
};

// 下载
function downNewVersion(appurl, must) {

    if (api.systemType == 'ios') {
        if (!appurl.match('itunes.apple.com')) { // 链接非itunes 则打开内置浏览器网页
            _url({
                url: appurl,
                must: must
            }, 'must_download');
        } else {
            api.installApp({
                appUri: appurl
            });
        }
    } else {
        if (!appurl.match('.apk')) { // 链接非apk 则打开内置浏览器网页
            _url({
                url: appurl,
                must: must
            }, 'must_download');
        } else {
            openUIActionProgress(appurl, must)
        }
    }
}