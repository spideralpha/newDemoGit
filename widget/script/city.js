// 选择城市
function selectCity() {
    var path = 'widget://res/city.json';
    openUIActionSelector(path, {
        col: 3,
        title: '城市'
    }, function (ret, err) {
        if (ret.eventType == 'ok') {
            console.log(JSON.stringify(ret))
            var city = ret.level1 + ret.level2 + ret.level3;
            $('.city input').val(city)
        }
    })
}


// 打开滑动模块
function openUIActionSelector(data, param, callback) {
    var UIActionSelector = api.require('UIActionSelector');
    var h = api.systemType == 'ios' ? 50 : 40;
    var row = api.systemType == 'ios' ? 3 : 5;
    var fontsize = api.systemType == 'ios' ? 14 : 12;
    var sizeActive = api.systemType == 'ios' ? 14 : 16;
    var actives = param.col == 1 ? [2] : [2, 0, 0]
    UIActionSelector.open({
        datas: data,
        layout: {
            row: row, // 每屏显示的数据行数
            col: param.col, // 数据源的数据级数
            height: h,
            size: fontsize,
            sizeActive: sizeActive,
            colorSelected: '#d43d3d'
        },
        cancel: {
            text: '取消',
            size: fontsize,
            color: '#555555',
            colorActive: '#555555'
        },
        ok: {
            text: '确定',
            size: fontsize,
            color: '#d43d3d',
            colorActive: '#d43d3d'
        },
        title: {
            text: '请选择' + param.title,
            size: fontsize,
        },
        actives: actives,
        fixedOn: api.frameName
    }, callback);
}