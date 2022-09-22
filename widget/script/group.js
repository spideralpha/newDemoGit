// 初始化group
function groupInit(name, frameArr, topH, footerH, index, el, pageParam, data, fn) {
    data = data ? data : {};
    var scrollEnabled = data.scrollEnabled;
    var bounces = data.bounces;
    var cls = data.cls;
    var pre = data.pre || 0;
    var allowEditArr = data.allowEdit || [];
    var frames = [];
    for (var i = 0, len = frameArr.length; i < len; i++) {
        var frame = {};
        frame.name = name + '_' + i;
        frame.url = html_win + frameArr[i] + '.html';
        frame.useWKWebView = true;
        if (allowEditArr.length > 0) {
            frame.allowEdit = allowEditArr[i] == 1 ? true : false;
        }
        if (data && data.fbg) {
            frame.bgColor = data.fbg;
        }
        if (pageParam && pageParam[i]) {
            frame.pageParam = pageParam[i];
        }
        frames.push(frame);
    }
    openFrameGroup(name, topH, footerH, index, el, frames, scrollEnabled, bounces, cls, pre, fn)
}


// 打开frameGroup
function openFrameGroup(name, topH, footerH, index, el, frames, scrollType, bounces, cls, pre, fn) {
    var scrollEnabled = scrollType == 0 ? false : true;
    api.openFrameGroup({
        name: name,
        scrollEnabled: scrollEnabled,
        bounces: false,
        rect: {
            x: 0,
            y: topH || 0,
            w: 'auto',
            // h: api.winHeight - topH - footerH,
            h: 'auto',
            marginBottom: footerH || 0
        },
        index: index || 0,
        frames: frames,
        preload: pre, // 预加载的 frame 个数，默认加载当前页后面一个
    }, function (ret, err) {
        var index = ret.index;
        if (el) {
            active(index, el, cls);
        }
        if (fn) {
            fn(ret.index);
        }
    });
}

// 点击样式
function active(index, el, cls) {
    cls = cls ? cls : 'active';
    $(el).removeClass(cls);
    $(el).eq(index).addClass(cls);
}