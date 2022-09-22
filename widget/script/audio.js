var Audio = function() {
    var audio = api.require('audioStreamer');
    var _this = this;

    // 播放
    _this.play = function(data, callback) {
        if (!data) return;
        audio.openPlayer({
            // path: 'widget://res/tip.mp3',
            path: data.url,
        }, function(ret) {
            console.log(JSON.stringify(ret))
            if (ret.status) {

            }
            if (typeof callback == 'function') {
                callback(ret);
            }
        });

        if (data.loop) {
            _this.loop();
        }
        if (data.volume) {
            _this.volume(data.volume);
        }

    }

    // 循环
    _this.loop = function() {
        audio.setLoop({
            loop: true
            // loop: type
        });
    }

    // 音量
    _this.volume = function(v) {
        audio.setVolume({
            // volume: 0.2
            volume: v
        });
    }

    // 停止
    _this.stop = function() {
        audio.stop();
    }

    // 使声音在听筒播放
    _this.call = function() {
        // audio.onCall();
        _this.normal();
    }

    // 正常播放声音
    _this.normal = function() {
        audio.onNormal();
    }
}