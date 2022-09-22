var UIIMG = function() {
    var UIAlbumBrowser = api.require('UIAlbumBrowser');
    var _this = this;

    // 打开
    _this.open = function(callback, imgType) {
        // all（图片和视频） image（图片） video（视频）
        var type = imgType ? imgType : 'image';
        UIAlbumBrowser.scan({
            type: type,
            count: 20,
            sort: {
                key: 'time',
                order: 'desc'
            },
            thumbnail: {
                w: 50,
                h: 50
            }
        }, function(ret) {
            if (ret) {
                // console.log(JSON.stringify(ret));
                if (typeof callback == 'function') {
                    callback(ret);
                }
            }
        });
    }

    // 加载下一页
    _this.next = function(callback) {
        // _loading();
        UIAlbumBrowser.fetch(function(ret, err) {
            // console.log(JSON.stringify(ret));
            // _loadingClose();
            if (ret) {
                if (typeof callback == 'function') {
                    callback(ret);
                }
            }
        });
    }

    // IOS转换路径
    _this.tran = function(arr, callback) {
        _d(0);
        // 转换图片路径
        function _d(index) {
            _this.transImg(arr[index].path, function(img) {
                arr[index].path = img;
                index++;
                if (index >= arr.length) {
                    callback(arr);
                } else {
                    _d(index);
                }
            })
        }
    }

    // 获取图片trans路径
    _this.transImg = function(path, callback) {
        UIAlbumBrowser.transPath({
            path: path
        }, function(ret, err) {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
            if (typeof callback == 'function') {
                callback(ret.path)
            }
        });
    }
    // IOS转换路径
    _this.tranV = function(arr, callback) {
        _d(0);
        // 转换图片路径
        function _d(index) {
            _this.transVideo(arr[index].path, function(img) {
                arr[index].path = img;
                index++;
                if (index >= arr.length) {
                    callback(arr);
                } else {
                    _d(index);
                }
            })
        }
    }

    // 获取图片trans路径
    _this.transVideo = function(path, callback) {
        UIAlbumBrowser.transVideoPath({
            path: path
        }, function(ret, err) {
            console.log(JSON.stringify(ret));
            console.log(JSON.stringify(err));
            if (typeof callback == 'function') {
                callback(ret.albumVideoPath)
            }
        });
    }
}