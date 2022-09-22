var utilModule = function() {
    var _this = this;
    var utilmodule = api.require('utilModule');
    _this.getAndroidID = function () {
        utilmodule.getAndroidID(function(ret, err){
            $api.setStorage('android_id', ret.androidID)
        });
    }

    _this.getChannel = function () {
        utilmodule.getChannel(function(ret, err){
            $api.setStorage('ad_channel', ret.channel)
        });
    }
}