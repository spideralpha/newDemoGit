// 判断年龄
function judgeAge(date) {
    var now = new Date();
    var age = now - new Date(date);
    console.log(age);
    var year = age / 1000 / 60 / 60 / 24 / 365;
    return Math.floor(year);
}

// 判断星座
function judgeXingZuo(date) {
    var _d = date.split('-');
    var m = _d[1];
    var d = _d[2];
    return "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(m*2-(d<"102223444433".charAt(m-1)- -19)*2,2);
}