var WS = function(index) {
    var ws = new WebSocket($api.getStorage('wsurl'));
    var _this = this;
    _this.index = index; // 用于标识重启的socket
    _this.status = 0; // 是否已打开
    // 打开链接
    _this.open = function(callback) {
        ws.onopen = function() {
            _this.status = 1;
            // Web Socket 已连接上，使用 send() 方法发送数据
            console.log('socket 已连接');
            if (typeof callback == 'function') {
                callback();
            }
        };
    }

    // 发送数据
    _this.send = function(msg) {
        if (!_this.status) return;
        ws.send(msg);
    }
    // 绑定
    _this.band = function() {
        if (!_this.status) return;
        var pre = '';
        if ($api.getStorage('pre')) {
            pre = $api.getStorage('pre');
        }
        ws.send(JSON.stringify({
            userid: pre + $api.getStorage('userid')
        }));
    }


    // 接收数据
    _this.get = function(callback) {
        ws.onmessage = function(evt) {
            var received_msg = evt.data;
            if (typeof callback == 'function') {
                if ($api.getStorage('userid')) {
                    callback(received_msg);
                }
            }
        };
    }
    // 关闭socket 
    _this.close = function() {
        ws.close();
    }
    // 监听到socket关闭了
    _this.onclose = function(callback) {
        ws.onclose = function() {
            console.log('socket 关闭了')
            setTimeout(function() {
                _send('socketclose');
            }, 1000)
        };
    }

    // 错误
    _this.onerror = function(callback) {
        ws.onerror = function(e) {
            console.log('socket发生错误');
            ws.close();
        }
    }

    _this.onclose();
    _this.onerror();
}