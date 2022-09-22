var view = new Vue({
    el: '#view',
    data: {
        imgurl: imgurl,
        ffList: [],
        ffInfo: {},
        myuserid: $api.getStorage('userid'),
        id: 0, // 红包id
    },
    methods: {
        _url(param, url) {
            _url(param, url);
        },
        // 返回图片路径
        returnImg(url) {
            return returnImg(url);
        },
        
    }
})
apiready = function () {
    $api.fixStatusBar($api.dom('header'));
    view.id = api.pageParam['id'];
    console.log(view.id)
    getDetail()
}
// 格式化输入
function limitMoney(obj) {
    obj.value = obj.value.replace(/[^0-9.]*$/, ""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    var money = obj.value || '0.00';
    $('#js-money').text('￥' + money);
}

// 获取红包详情
function getDetail() {
    _ajax('home/privatechat/details', function (ret, err) {
        console.log(JSON.stringify(ret))
        console.log(JSON.stringify(err))
        if (ret && ret.code == 200) {
            view.ffInfo = ret.data;
            _send('updateHB', {
                id: view.id,
                state: ret.data.state
            });
        }
    }, {
        chat_id: view.id,
    })
}