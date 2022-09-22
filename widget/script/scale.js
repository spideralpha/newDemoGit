// https://www.cnblogs.com/zhoufuwei/p/7647203.html
function a2d(n) {
    return n * 180 / Math.PI;
}
var imgRotateType = 1; // 0 可旋转 1不可旋转

document.addEventListener('DOMContentLoaded', function () {
    var oDiv = document.querySelector('#scale-img');

    var x = 0;
    var y = 0;
    var d = 0;
    var s = 1;
    var timeOutEvent; // 长按或点击

    oDiv.addEventListener('touchstart', function (ev) {
        var oldX = x;
        var oldY = y;
        var oldD = d;
        var oldS = s;

        if (!timeOutEvent) {
            setTimeout(function () {
                timeOutEvent = 1;
            }, 800);
        } else {
            timeOutEvent = 0;
        }

        function getT(ev) {
            var x1 = ev.targetTouches[0].pageX;
            var y1 = ev.targetTouches[0].pageY;

            var x2 = ev.targetTouches[1].pageX;
            var y2 = ev.targetTouches[1].pageY;

            var x = (x1 + x2) / 2;
            var y = (y1 + y2) / 2;

            return {
                x: x,
                y: y
            };
        }

        function getD(ev) {
            var x1 = ev.targetTouches[0].pageX;
            var y1 = ev.targetTouches[0].pageY;

            var x2 = ev.targetTouches[1].pageX;
            var y2 = ev.targetTouches[1].pageY;

            var x = x2 - x1;
            var y = y1 - y2;

            return a2d(Math.atan2(y, x));
        }

        function getS(ev) {
            var x1 = ev.targetTouches[0].pageX;
            var y1 = ev.targetTouches[0].pageY;

            var x2 = ev.targetTouches[1].pageX;
            var y2 = ev.targetTouches[1].pageY;

            var a = x1 - x2;
            var b = y1 - y2;
            return Math.sqrt(a * a + b * b);
        }



        if (ev.targetTouches.length == 2) {
            var downX = getT(ev).x;
            var downY = getT(ev).y;
            var downD = getD(ev);
            var downS = getS(ev);
        }

        document.addEventListener('touchmove', function (ev) {

            if (ev.targetTouches.length == 2) {
                x = oldX + getT(ev).x - downX;
                y = oldY + getT(ev).y - downY;
                d = oldD + downD - getD(ev);
                s = oldS * getS(ev) / downS;
                console.log(s);
                if (imgRotateType == 1) {
                    oDiv.style.WebkitTransform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
                } else {
                    oDiv.style.WebkitTransform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ') rotate(' + d + 'deg)';
                }
                setTimeout(function () {
                    if (!isNaN(s) && s < 1) {
                        x = 0;
                        y = 0;
                        d = 0;
                        s = 1;
                        oDiv.style.WebkitTransform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
                    }
                }, 1000)
                timeOutEvent = 0;
            } else if (ev.targetTouches.length == 1) {
                if (timeOutEvent == 1) {
                    timeOutEvent = 0;
                    longpress();
                }
            }
        }, false);
        // ev.preventDefault();
    }, false);
}, false);

// 长按 函数 此方法不可删除，除非调用该js的文件都有该函数
function longpress() {

}