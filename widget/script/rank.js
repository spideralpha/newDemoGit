var nameObj = {
    1: '亲密度',
    2: '女神指数',
    3: '土豪值',
    5: '威望值',
    6: '魅力值',
    8: '邀请人数'
};
var view = new Vue({
    el: '#view',
    data: {
        imgurl: imgurl,
        ffList: [],
        ffInfo: {},
        ios: 1, // 1上架 0非上架
        types: 0, // 1恩爱(亲密度)|2女神(收到礼物)|3富豪(送出礼物)|4男神(收到礼物)|5家族(威望)|6(魅力值)|8邀请
        typeidx: 1, // 1日榜 | 2周榜 | 3月榜 | 4总榜
        typeName: ''
    },
    methods: {
        // 跳转
        _url(param, url) {
            _url(param, url);
        },
        // 返回图片路径
        returnImg(url) {
            return returnImg(url);
        },
        returnCount(count) {
            return count + obj[view.types];
        },
        // 跳转 查看用户详情
        go_userInfo(id, name, sex) {
            go_userInfo(id, name, sex)
        },
    }
})

apiready = function() {
    view.types = api.pageParam['types'];
    view.typeName = nameObj[view.types];
    getData()
    _scrollToBottom(function() {
        if (heigutgao == 1) {
            pagenum++;
            _lists('api/Ranking/lists', pagenum, '', {
                types: view.types,
                time: view.typeidx
            });
        }
    })
}

function changeTime(index) {
    console.log(api.frameName)
    view.typeidx = index;
    getData()
}

function getData() {
    _lists('api/Ranking/lists', 1, 1, {
        types: view.types,
        time: view.typeidx
    });
}