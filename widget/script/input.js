// 添加表情
function handleTag(imgname) {
    var img = '../../res/img/emotion/' + imgname + '.png';
    var html = `<img  src="${img}">`;
    // 转dom对象
    var objE = document.createElement("div");
    objE.innerHTML = html;
    var parseDom = objE.childNodes[0];
    // 在光标处插入dom
    if(!view.range){
        $('#js-input').append(html);
    }else{
        view.range.insertNode(parseDom);
        // 光标开始和光标结束重叠
        view.range.collapse(false);
    }
    // var pos = ++view.rangeStartOffset;

    // var Sel = document.selection.createTextRange();
    // view.range.moveEnd('character', pos);
    // view.range.moveStart('character', pos);
    // view.range.select();
}

// 记录光标位置等 （debounce防抖提升性能）
function handleSelection() {
    var _this = view;
    _this.selection = window.getSelection();
    // 光标对象
    _this.range = _this.selection.getRangeAt(0);
    // 获取光标对象的范围界定对象
    _this.textNode = _this.range.startContainer;
    // 获取光标位置
    _this.rangeStartOffset = _this.range.startOffset;
}

