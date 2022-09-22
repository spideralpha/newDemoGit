var SHANYAN = function(type) {
    var shanyan = api.require('clSDKShanYanSDKModule');
    // var shanyan;
    var _this = this;

    // var screenWidth_Portrait = window.innerWidth; //竖屏宽
    // var screenHeight_Portrait = window.innerHeight; //竖屏宽
    // var screenWidth_Landscape = window.innerHeight; //横屏宽(即竖屏高)
    // var screenHeight_Landscape = window.innerWidth; //横屏高(即竖屏宽)
    var screenWidth_Portrait = api.winWidth; //竖屏宽
    var screenHeight_Portrait = api.winHeight; //竖屏宽
    var screenWidth_Landscape = api.winHeight; //横屏宽(即竖屏高)
    var screenHeight_Landscape = api.winWidth; //横屏高(即竖屏宽)
    if (type) {
        // var logoT = $('#js-logo').offset().top - api.safeArea.top;
        var loginT = $('.btn-container').offset().top - api.safeArea.top;
        var otherT = $('#js-other-btn').offset().top - api.safeArea.top;
        var qtfsT = $('.line-wrap .op').eq(0).offset().top - api.safeArea.top;
        var qtfsL = $('.line-wrap .op').eq(0).offset().left;
        var ydwt = $('.line-wrap .op').eq(1).offset().left;
        var wxBtnT = $('.login-img').eq(0).offset().top - 10;
        var wxBtnL = $('.login-img').eq(0).offset().left + 10;
        if (SHOWQQ) {
            var qqBtnL = $('.login-img').eq(1).offset().left + 10;
        }
        var xieyiL = $('#js-xieyi').offset().left - api.safeArea.left;
    }

    var screenScale = screenWidth_Portrait / 375.0; //相对iphone6屏幕
    if (screenScale > 1) {
        screenScale = 1; //大屏的无需放大
    }
    //竖屏
    //窗口中心
    var clAuthWindowOrientationCenterX_Portrait = screenWidth_Portrait * 0.5;
    var clAuthWindowOrientationCenterY_Portrait = screenHeight_Portrait * 0.5;

    //窗口宽高
    var clAuthWindowOrientationWidth_Portrait = screenWidth_Portrait * 0.8;
    var clAuthWindowOrientationHeight_Portrait = clAuthWindowOrientationWidth_Portrait * 0.8;

    var clLayoutLogoTop_Portrait = screenScale * 225;
    var clLayoutLogoWidth_Portrait = 100 * screenScale;
    var clLayoutLogoHeight_Portrait = 100 * screenScale;
    var clLayoutLogoCenterX_Portrait = 0;

    var clLayoutPhoneCenterY_Portrait = -20 * screenScale;
    var clLayoutPhoneLeft_Portrait = 50 * screenScale;
    var clLayoutPhoneRight_Portrait = -50 * screenScale;
    var clLayoutPhoneHeight_Portrait = 20 * screenScale;

    var clLayoutLoginBtnCenterY_Portrait = clLayoutPhoneCenterY_Portrait + clLayoutPhoneHeight_Portrait * 0.5 *
        screenScale + 20 * screenScale + 15 * screenScale;
    var clLayoutLoginBtnHeight_Portrait = 50 * screenScale;
    var clLayoutLoginBtnLeft_Portrait = 70 * screenScale;
    var clLayoutLoginBtnRight_Portrait = -70 * screenScale;

    var clLayoutAppPrivacyLeft_Portrait = 40 * screenScale;
    var clLayoutAppPrivacyRight_Portrait = -40 * screenScale;
    var clLayoutAppPrivacyBottom_Portrait = 0 * screenScale;
    var clLayoutAppPrivacyHeight_Portrait = 45 * screenScale;

    var clLayoutSloganLeft_Portrait = 0;
    var clLayoutSloganRight_Portrait = 0;
    var clLayoutSloganHeight_Portrait = 15 * screenScale;
    var clLayoutSloganBottom_Portrait = clLayoutAppPrivacyBottom_Portrait - clLayoutAppPrivacyHeight_Portrait;

    //横屏
    //窗口中心
    var clAuthWindowOrientationCenterX_Landscape = screenWidth_Landscape * 0.5;
    var clAuthWindowOrientationCenterY_Landscape = screenHeight_Landscape * 0.5;

    //窗口宽高
    var clAuthWindowOrientationWidth_Landscape = screenWidth_Portrait * 0.8; //窗口宽度为竖屏宽度的0.8;
    var clAuthWindowOrientationHeight_Landscape = clAuthWindowOrientationWidth_Landscape * 0.8; //窗口高度为窗口宽度的0.8

    var clLayoutLogoWidth_Landscape = 60 * screenScale;
    var clLayoutLogoHeight_Landscape = 60 * screenScale;
    var clLayoutLogoCenterX_Landscape = 0;
    var clLayoutLogoTop_Landscape = 25 * screenScale;

    var clLayoutPhoneCenterY_Landscape = -20 * screenScale;
    var clLayoutPhoneLeft_Landscape = 50 * screenScale;
    var clLayoutPhoneRight_Landscape = -50 * screenScale;
    var clLayoutPhoneHeight_Landscape = 20 * screenScale;

    var clLayoutLoginBtnCenterY_Landscape = clLayoutPhoneCenterY_Landscape + clLayoutPhoneHeight_Landscape *
        0.5 *
        screenScale + 20 * screenScale + 15 * screenScale;
    var clLayoutLoginBtnHeight_Landscape = 30 * screenScale;
    var clLayoutLoginBtnLeft_Landscape = 70 * screenScale;
    var clLayoutLoginBtnRight_Landscape = -70 * screenScale;

    var clLayoutAppPrivacyLeft_Landscape = 40 * screenScale;
    var clLayoutAppPrivacyRight_Landscape = -40 * screenScale;
    var clLayoutAppPrivacyBottom_Landscape = 0 * screenScale;
    var clLayoutAppPrivacyHeight_Landscape = 45 * screenScale;

    var clLayoutSloganLeft_Landscape = 0;
    var clLayoutSloganRight_Landscape = 0;
    var clLayoutSloganHeight_Landscape = 15 * screenScale;
    var clLayoutSloganBottom_Landscape = clLayoutAppPrivacyBottom_Landscape -
        clLayoutAppPrivacyHeight_Landscape;


    //  初始化
    _this.init = function(appid, callback) {
        // code为1022:成功；其他：失败
        shanyan.init({
            appid: appid
        }, function(ret, err) {
            console.log('初始化成功');
            console.log(JSON.stringify(ret))
            console.log(JSON.stringify(err))
            if (ret) {
                if ((api.systemType != 'ios' && ret.code == 1022) || (api.systemType == 'ios' && ret.code == 1000)) {
                    _this.getPhone(callback);
                }
            }
        })
    }
    // 预取号
    _this.getPhone = function(callback) {
        // code为1022：成功；其他：失败
        if (api.systemType != 'ios') {
            shanyan.preLogin(function(ret, err) {
                console.log(JSON.stringify(ret));
                // alert(JSON.stringify(ret));
                if (typeof callback == 'function') {
                    var code = ret.code == 1022 ? 200 : 400;
                    callback(code, ret);
                }
            });
        } else {
            shanyan.preGetPhonenumber(function(retg, errg) {
                console.log('预取号==========')
                console.log(JSON.stringify(retg))
                console.log(JSON.stringify(errg))
                if (typeof callback == 'function') {
                    var code = errg == null ? 200 : 400;
                    callback(code, retg);
                }
            });
        }
    }

    // 拉起授权页
    _this.login = function(callback) {
        _loading();
        if (api.systemType != 'ios') {
            // 配置ui 每次调用拉起授权页方法前必须先调用该方法，否则授权界面会展示异常。
            shanyan.setAuthThemeConfig(_this.view, function(ret, err) {
                console.log(JSON.stringify(ret));
                console.log(JSON.stringify(err));
                if (ret && ret.code == 0 && ret.result) {
                    view.login = 0;
                    _this.customClick(ret.result)
                }
                // setTimeout(function () {
                //     _this.destroy();
                // }, 500)
            })
            // 当type=0时是拉起授权页回调（ret.type）：
            // 当type=1时是一键登录回调（ret.type）：
            // code为1000：点击一键登录获取token成功
            // 拉起授权页
            setTimeout(function() {
                shanyan.openActivity({
                    isFinish: true
                }, function(ret, err) {
                    console.log(JSON.stringify(ret))
                    // alert(JSON.stringify(ret));

                    _loadingClose();
                    view.login = 1;
                    if (ret.type == 1 && ret.code == 1011) {
                        view.login = 0;
                    }
                    if (ret.type == 1 && ret.code == 1000) {
                        if (typeof ret.result == 'string') {
                            ret.result = JSON.parse(ret.result);
                        }
                        var token = ret.result.token;
                        view.login = 0;
                        if (typeof callback == 'function') {
                            callback(token);
                        }
                    }
                });
            }, 500)
        } else {
            // 调起授权页 ios无直接返回值 故需使用openLoginAuthListener进行监听
            shanyan.openLoginAuthListener({}, function(ret, err) {
                console.log('=======openLoginAuthListener========')
                //openLoginAuthListener:调起授权页回调
                api.hideProgress();
                if (err != null) {
                    //调起授权页 失败
                    _loadingClose();
                    _url({
                        url: 'user/login',
                        title: '登录'
                    });
                } else {
                    console.log('=======调起授权页 成功========')
                    //调起授权页 成功
                    view.login = 1;
                    _loadingClose();
                    _this.listener(callback);
                }
                console.log(JSON.stringify(ret));
            });
            // 监听自定义控件 点击
            shanyan.setCustomInterface(function(ret, err) {
                console.log('=======监听自定义控件 点击========')
                console.log(JSON.stringify(ret));
                // alert(JSON.stringify(err));
                view.login = 0;
                if (ret && ret.widgetId) {
                    _this.customClick(ret.widgetId)
                }
                // _this.destroy();
            });
            // 调起授权页 ios无直接返回值
            shanyan.quickAuthLoginWithConfigure(_this.iosview);
        }
    }

    // 监听
    _this.listener = function(callback) {
        shanyan.oneKeyLoginListener({}, function(ret, err) {
            //oneKeyLoginListener:调起授权页成功，后续回调
            console.log(JSON.stringify(ret));
            if (err != null) {
                view.login = 0;
                if (err.errorCode == 1011) {
                    //点了返回,自动授权页关闭
                    //提示：错误无需提示给用户，可以在用户无感知的状态下直接切换登录方式
                    //用户取消登录（点返回）
                    //处理建议：如无特殊需求可不做处理，仅作为交互状态回调，此时已经回到当前用户自己的页面
                    //点击sdk自带的返回，无论是否设置手动销毁，授权页面都会强制关闭
                } else {

                    //处理建议：其他错误代码表示闪验通道无法继续，可以统一走开发者自己的其他登录方式，也可以对不同的错误单独处理
                    //关闭授权页
                    _this.destroy();
                }
            } else {
                //SDK获取Token成功
                if (ret && ret.data && ret.data.token) {
                    callback(ret.data.token)
                }
                //此处根据token调用户后台接口获取手机号，获取成功或失败后再调shanYanSDKModule.finishAuthControllerCompletion()关闭页面
                // //关闭授权页
                _this.destroy();
            }
        });
    }

    // 销毁
    _this.destroy = function() {
        if (api.systemType != 'ios') {
            shanyan.finishAuthActivity();
        } else {
            shanyan.finishAuthControllerCompletion();
        }
    }

    // 点击事件
    _this.click = function() {
        shanyan.setActionListener(function(ret) {
            console.log("callback---setActionListener========" + JSON.stringify(ret));
            // alert(JSON.stringify(ret));
        })
    }
    // 自定义控件点击
    _this.customClick = function(type) {
        view.login = 0;
        switch (type) {
            case 'customView_one':
                // 其他手机号码登入
                _url({
                    url: 'user/login',
                    title: '登录'
                });
                break;
            case 'customView_two':
                // 其他登录方式
                _url({
                    url: 'user/loginpwd',
                    title: '登录'
                });
                break;
            case 'customView_tri':
                // 遇到问题
                _url({
                    url: 'about',
                    title: '遇到问题',
                    id: 10
                })
                break;
            case 'customView_for':
                // vx
                login(0);
                break;
            case 'customView_fiv':
                // qq
                login(1);
                break;
            default:
                break;
        }
    }
    // 配置
    _this.config = {
        bgImg: 'image/bg2.png', // 背景
        // bgImg: '', // 背景
        navHidde: true, // 是否隐藏导航栏
        navBg: '#ffffff',
        navTxt: '一键登录',
        navColor: '#000000',
        navSize: '16',
        navClear: true, // 导航是否透明

        logoImg: 'image/logo.png',

        phoneColor: '#ffffff',
        phoneSize: 20,

        loginTxt: '本机号码一键登录',
        loginColor: '#C244DD',
        loginSize: 16,
        loginImg: 'image/btn2.png',
        check: false,
        otherImg: 'image/btn2.png',

        xieyiSize: 12,
        xieyiSM: false, // 书名号
        xieyiOne: {
            title: '用户协议',
            url: base_url + "api/page/index/id/2"
        },
        xieyiTwo: {
            title: '隐私政策',
            url: base_url + "api/page/index/id/3"
        },
        xy1: '我已阅读并同意',
        xy2: '、',
        xy3: '&',
        xy4: '授权登录',

        xyCheckImg: 'image/radio.png', // 未选中
        xyCheckImgs: 'image/radio_select.png', // 选中

    }

    // 授权页ui
    _this.view = {
        // https://shanyan.253.com/document/details?lid=519&cid=93&pc=28&pn=%25E9%2597%25AA%25E9%25AA%258CSDK
        // 查看安卓配置
        uiConfig: {
            setAuthBGImgPath: 'widget://' + _this.config.bgImg, // 背景
            setNavColor: _this.config.navBg,
            setNavText: _this.config.navTxt,
            setNavTextColor: _this.config.navColor,
            setNavTextSize: _this.config.navSize,
            setAuthNavTransparent: _this.config.navClear,
            setAuthNavHidden: _this.config.navHidde,

            setNavReturnBtnWidth: '25',
            setNavReturnImgPath: 'sy_sdk_left',
            setNavReturnBtnOffsetX: '0',
            setNavReturnBtnOffsetY: '-1',
            setNavReturnBtnOffsetRightX: '-1',
            setNavReturnBtnHeight: '25',
            setNavReturnImgHidden: 'false',


            // logo
            setLogoWidth: "75", //设置logo宽度
            setLogoHeight: "75", //设置logo高度
            setLogoImgPath: 'widget://' + _this.config.logoImg,
            // setLogoOffsetX: '', //设置logo相对屏幕左侧X偏移
            setLogoOffsetY: screenHeight_Portrait * 0.16 - api.safeArea.top, //设置logo相对于标题栏下边缘y偏移
            // setLogoOffsetBottomY: '', //设置logo相对于屏幕底部y偏移
            // setLogoHidden: '', //设置logo是否隐藏（true：隐藏；false：不隐藏）


            // 号码
            setNumberColor: _this.config.phoneColor, //设置号码栏字体颜色
            setNumFieldOffsetY: screenHeight_Portrait * 0.16 - api.safeArea.top + 75 + 50, //设置号码栏相对于标题栏下边缘y偏移
            // setNumFieldOffsetBottomY: '', //设置号码栏相对于屏幕底部y偏移
            // setNumFieldOffsetX: '', //设置号码栏相对屏幕左侧X偏移
            // setNumFieldWidth: '', //设置号码栏宽度
            // setNumFieldHeight: '', //设置号码栏高度
            setNumberSize: _this.config.phoneSize,
            // setNumberBold: '', //号码栏字体是否加粗（true：加粗；false：不加粗）
            // setTextSizeIsdp: '', //授权页字体单位是否用dp（true：是；false：不是，sp单位）

            // 登录按钮
            setLogBtnText: _this.config.loginTxt, //设置登录按钮文字
            setLogBtnTextColor: _this.config.loginColor, //设置登录按钮文字颜色
            setLogBtnImgPath: 'widget://' + _this.config.loginImg, //设置授权登录按钮图片
            setLogBtnOffsetY: loginT, //设置登录按钮相对于标题栏下边缘Y偏移
            // setLogBtnOffsetBottomY: '', //设置登录按钮相对于屏幕底部Y偏移
            setLogBtnTextSize: _this.config.loginSize, //设置登录按钮字体大小
            setLogBtnHeight: 47, //设置登录按钮高度
            setLogBtnWidth: screenWidth_Portrait - 40, //设置登录按钮宽度
            // setLogBtnOffsetX: '', //设置登录按钮相对屏幕左侧X偏移
            setLogBtnTextBold: true, //登录按钮字体是否加粗（true：加粗；false：不加粗）

            // 隐私协议
            setPrivacyState: _this.config.check, //设置隐私条款的CheckBox是否选中（true：选中；false：未选中）
            setUncheckedImgPath: 'widget://' + _this.config.xyCheckImg, //设置隐私条款的CheckBox未选中时图片
            setCheckedImgPath: 'widget://' + _this.config.xyCheckImgs, //设置隐私条款的CheckBox选中时图片
            setCheckBoxHidden: false, //设置隐私条款的CheckBox是否隐藏（true：隐藏；false：不隐藏）
            setCheckBoxWH: { //设置checkbox的宽高，包含两个参数：1.宽 2.高
                width: 16,
                height: 16
            },
            //设置checkbox在协议框父控件中的位置，包含两个参数：
            //1.左偏移量 2.上偏移量（不设置默认居中）
            // setCheckBoxOffsetXY: {
            //     x: '',
            //     y: ''
            // },
            //设置checkbox的间距，包含四个参数：1.左间距 2.上间距 3.右间距 4.下间距
            // setCheckBoxMargin: {
            //     // marginLeft: 8,
            //     // marginTop: '',
            //     // marginRight: '',
            //     // marginBottom: ''
            // },

            setPrivacyTextBold: false, //设置隐私条款字体的是否加粗（true：加粗；false：不加粗）
            setPrivacyCustomToastText: '请先勾选协议', //授权页toast文本设置
            setPrivacyNameUnderline: false, //设置隐私条款是否显示下划线（true：显示；false：不显示）
            setOperatorPrivacyAtLast: true, //设置运营商协议是否放到最后（true：是；false：不是）
            setPrivacySmhHidden: _this.config.xieyiSM, //设置协议名称是否显示书名号《》，默认显示书名号（true：不显示；false：显示）
            setPrivacyTextSize: _this.config.xieyiSize, //设置隐私栏字体大小
            // setPrivacyOffsetBottomY: screenWidth_Portrait * 0.1 - 16, //设置隐私条款相对于授权页面底部下边缘y偏移
            setPrivacyOffsetBottomY: 16, //设置隐私条款相对于授权页面底部下边缘y偏移
            // setPrivacyOffsetY: '', //设置隐私条款相对于授权页面标题栏下边缘y偏移
            setPrivacyOffsetX: xieyiL - 24, //设置隐私条款相对屏幕左侧X偏移
            // setPrivacyOffsetGravityLeft: '', //设置隐私条款文字左对齐（true：左对齐；false：居中）

            setAppPrivacyColor: { //设置隐私条款文字颜色，包含两个参数：1.基础文字颜色 2.协议文字颜色
                privacyBaseColor: '#ffffff',
                privacyColor: '#ffffff',
            },
            setPrivacyText: {
                privacyTextOne: _this.config.xy1,
                privacyTextTwo: _this.config.xy2,
                privacyTextThree: _this.config.xy3,
                // privacyTextFour: "授权登录",
                privacyTextFive: _this.config.xy4
            },
            setAppPrivacyOne: _this.config.xieyiOne,
            setAppPrivacyTwo: _this.config.xieyiTwo,
            // setAppPrivacyThree: {
            //     title: '服务协议',
            //     url: "https://api.253.com/api_doc/yin-si-zheng-ce/ge-ren-xin-xi-bao-hu-sheng-ming.html"
            // },
            setSloganHidden: false, //设置slogan是否隐藏（true：隐藏；false：不隐藏）
            setSloganTextColor: '#ffffff', //设置slogan文字颜色
            // setSloganTextSize: '', //设置slogan文字字体大小
            // setSloganOffsetY: '', //设置slogan相对于标题栏下边缘y偏移
            // setSloganOffsetBottomY: '', //设置slogan相对屏幕底部Y偏移
            // setSloganOffsetX: '', //设置slogan相对屏幕左侧X偏移
            // setSloganTextBold: '', //设置slogan字体的是否加粗（true：加粗；false：不加粗）

            setDialogTheme: {
                width: screenWidth_Portrait,
                height: screenHeight_Portrait,
                // width: screenWidth_Portrait/2,
                // height: screenHeight_Portrait/2,
                marginLeft: "0",
                marginTop: "0",
                isBottom: "false"
            }
        },
        widgets: {
            widget1: {
                widgetId: "customView_one",
                type: "TextView",
                top: otherT,
                // left: "",
                // right: "",
                // bottom: "",
                // width: screenWidth_Portrait * 0.75,
                height: 19,
                textContent: "其他手机号码登入",
                textFont: 14,
                textColor: "#ffffff",
                // backgroundColor: "",
                // backgroundImgPath: 'widget://' + _this.config.otherImg,
                isFinish: true
            },
            widget2: {
                widgetId: "customView_two",
                type: "TextView",
                top: qtfsT,
                left: qtfsL,
                // right: "",
                // bottom: "",
                width: 100,
                // height: "50",
                textContent: "其他方式",
                textFont: 11,
                textColor: "#ffffff",
                // backgroundColor: "",
                // backgroundImgPath: 'widget://' + _this.config.otherImg,
                isFinish: true
            },
            widget3: {
                widgetId: "customView_tri",
                type: "TextView",
                top: qtfsT,
                left: ydwt,
                // right: "",
                // bottom: "",
                width: 100,
                // height: "50",
                textContent: "遇到问题",
                textFont: 11,
                textColor: "#ffffff",
                // backgroundColor: "",
                // backgroundImgPath: 'widget://' + _this.config.otherImg,
                isFinish: true
            },
            widget4: {
                widgetId: "customView_for",
                type: "ImageView",
                top: wxBtnT,
                left: wxBtnL,
                // right: "",
                // bottom: "",
                width: "35",
                height: "35",
                // backgroundImgPath: 'widget://image/wx@2x.png',
                backgroundImgPath: '../../image/wx@2x.png',
                isFinish: true
            },
            widget5: {
                widgetId: "customView_fiv",
                type: "ImageView",
                left: qqBtnL,
                top: wxBtnT,
                // right: "",
                // bottom: "",
                width: "35",
                height: "35",
                // backgroundImgPath: 'widget://image/qq@2x.png',
                backgroundImgPath: '../../image/qq@2x.png',
                isFinish: true
            },
        },
    };
    _this.iosview = {
        clBackgroundColor: [0, 0, 0, 0],
        // clBackgroundImg: _this.config.bgImg, //授权页-背景图片
        // clAuthPageCloseAnimate: '', //关闭授权页面动画，默认true
        // clAuthWindowPresentingAnimate: '', //弹出授权页面动画，默认true

        clNavigationBarHidden: _this.config.navHidde, //导航栏 是否隐藏
        clNavigationBackgroundClear: _this.config.navClear, //导航栏 背景透明
        // clNavigationBackBtnImage: '', //导航栏左侧返回按钮图片
        // clNavigationBackBtnHidden: '', //导航栏自带返回按钮隐藏
        // clNavBackBtnAlimentRight: '', //自带返回(关闭)按钮位置居右
        // clNavigationBottomLineHidden: '', //导航栏分割线 是否隐藏
        // clNavigationTintColor: '', //导航栏 文字颜色
        // clNavigationBarTintColor: '', //导航栏 背景色
        // clNavigationBackgroundImage: '', //导航栏 背景图片
        // clNavigationShadowImage: '', //导航栏 导航栏底部分割线（图片
        // clNavigationBarStyle: '', //UIBarStyleBlack

        clLogoImage: _this.config.logoImg, //LOGO图片
        // clLogoCornerRadius: '', //LOGO图片
        // clLogoHiden: '', //LOGO显隐

        clPhoneNumberColor: [1, 1, 1, 1], //手机号颜色
        clPhoneNumberFont: _this.config.phoneSize, //手机号字体
        // clPhoneNumberTextAlignment: '', //手机号对齐方式

        clLoginBtnText: _this.config.loginTxt, //按一键登录钮文字
        clLoginBtnTextColor: [0.76, 0.27, 0.87, 1], //一键登录按钮文字颜色
        // clLoginBtnBgColor: '', //一键登录按钮背景颜色
        clLoginBtnTextFont: _this.config.loginSize, //一键登录按钮文字字体
        //    clLoginBtnNormalBgImage: _this.config.loginImg, //一键登录按钮背景图片
        //    clLoginBtnHightLightBgImage: _this.config.loginImg, //一键登录按钮背景高亮图片
        // clLoginBtnBorderColor: '', //一键登录按钮边框颜色
        // clLoginBtnCornerRadius: '', //一键登录按钮圆角
        // clLoginBtnBorderWidth: '', //一键登录按钮边框

        clAppPrivacyColor: [
            [1, 1, 1, 1],
            [1, 1, 1, 1]
        ], //隐私条款名称颜色：[基础文字颜色rgba,款颜色rgba]
        clAppPrivacyTextFont: _this.config.xieyiSize, //隐私条款文字字体
        // clAppPrivacyTextAlignment: '', //隐私条款文字对齐方式
        clAppPrivacyPunctuationMarks: _this.config.xieyiSM, //运营商隐私条款书名号
        // clAppPrivacyLineSpacing: '', //多行时行距
        // clAppPrivacyNeedSizeToFit: '', //是否需要sizeToFit，设置后与宽高约束的冲突请自行考虑
        // clAppPrivacyAbbreviatedName: '', //隐私条款--APP名称简写 默认取CFBundledisplayname
        // 设置描述文本四后此属性无效
        clAppPrivacyFirst: [_this.config.xieyiOne.title, _this.config.xieyiOne.url], //隐私条款一:需同时设置Name和UrlString
        clAppPrivacySecond: [_this.config.xieyiTwo.title, _this.config.xieyiTwo.url], //隐私条款二:需同时设置Name和UrlString
        clAppPrivacyNormalDesTextFirst: _this.config.xy1, //描述文本一 default:"同意"
        clAppPrivacyNormalDesTextSecond: _this.config.xy2, //描述文本二 default:"和"
        clAppPrivacyNormalDesTextThird: _this.config.xy3, //描述文本三 default:"、"
        clAppPrivacyNormalDesTextFourth: _this.config.xy4, //描述文本四 default: "并授权AppName使用认证服务"

        // clAppPrivacyWebBackBtnImage: '', //隐私协议WEB页面导航返回按钮图片
        // clSloganTextFont: '', //运营商品牌标签文字字体
        clSloganTextColor: [1, 1, 1, 1], //运营商品牌标签文字颜色
        // clSlogaTextAlignment: '', //运营商品牌标签文字对齐方式

        clCheckBoxHidden: false, //协议勾选框
        clCheckBoxValue: _this.config.check, //协议勾选框默认值（默认不选中
        clCheckBoxSize: [16, 16], //协议勾选框 尺寸
        // clCheckBoxImageEdgeInsets: '', //协议勾选框 UIButton.image图片缩进
        clCheckBoxVerticalAlignmentToAppPrivacyTop: true, //协议勾选框 设置CheckBox顶部与隐私协议控件顶部对齐
        // clCheckBoxVerticalAlignmentToAppPrivacyCenterY: '', //协议勾选框 设置CheckBox顶部与隐私协议控件竖向中心对齐
        clCheckBoxUncheckedImage: _this.config.xyCheckImg, //协议勾选框 非选中状态图片
        clCheckBoxCheckedImage: _this.config.xyCheckImgs, //协议勾选框 选中状态图片

        // clLoadingSize: '', //Loading 大小
        // clLoadingCornerRadius: '', //Loading 圆角
        // clLoadingBackgroundColor: '', //Loading 背景色
        // clLoadingTintColor: '', //Loading Indicator渲染色

        shouldAutorotate: false, //是否支持自动旋转
        supportedInterfaceOrientations: 5, //支持方向
        // preferredInterfaceOrientationForPresentation: '', //默认方向
        clAuthTypeUseWindow: true, //以窗口方式显示 default is NO
        // clAuthWindowCornerRadius: '', //窗口圆角
        // clAuthWindowModalTransitionStyle: '', //弹出方式
        // clOrientationLayOutLandscape: '', //布局类（横屏）

        //竖屏布局对象
        clOrientationLayOutPortrait: {
            //窗口
            clAuthWindowOrientationWidth: screenWidth_Portrait,
            clAuthWindowOrientationHeight: screenHeight_Portrait,

            clAuthWindowOrientationCenterX: clAuthWindowOrientationCenterX_Portrait,
            clAuthWindowOrientationCenterY: clAuthWindowOrientationCenterY_Portrait,

            //控件
            clLayoutLogoWidth: 75,
            clLayoutLogoHeight: 75,
            clLayoutLogoCenterX: clLayoutLogoCenterX_Portrait,
            clLayoutLogoTop: screenHeight_Portrait * 0.16,
            // clLayoutLogoCenterY: screenHeight_Portrait * 0.16 - api.safeArea.top, //设置logo相对于标题栏下边缘y偏移

            clLayoutPhoneHeight: clLayoutPhoneHeight_Portrait,
            clLayoutPhoneLeft: clLayoutPhoneLeft_Portrait,
            clLayoutPhoneRight: clLayoutPhoneRight_Portrait,
            clLayoutPhoneTop: screenHeight_Portrait * 0.16 + 150, //
            // clLayoutPhoneCenterY: screenHeight_Portrait * 0.16 - api.safeArea.top + 75 + 14, //设置号码栏相对于标题栏下边缘y偏移

            clLayoutLoginBtnTop: loginT + api.safeArea.top - 2,
            clLayoutLoginBtnHeight: clLayoutLoginBtnHeight_Portrait,
            clLayoutLoginBtnLeft: clLayoutLoginBtnLeft_Portrait,
            clLayoutLoginBtnRight: clLayoutLoginBtnRight_Portrait,

            clLayoutAppPrivacyLeft: clLayoutAppPrivacyLeft_Portrait,
            clLayoutAppPrivacyRight: clLayoutAppPrivacyRight_Portrait,
            clLayoutAppPrivacyBottom: -25,
            // clLayoutAppPrivacyHeight: clLayoutAppPrivacyHeight_Portrait,

            clLayoutSloganLeft: clLayoutSloganLeft_Portrait,
            clLayoutSloganRight: clLayoutSloganRight_Portrait,
            clLayoutSloganHeight: clLayoutSloganHeight_Portrait,
            clLayoutSloganTop: screenHeight_Portrait * 0.16 + 100,
        },
        //横屏布局对象
        clOrientationLayOutLandscape: {
            //窗口
            clAuthWindowOrientationWidth: clAuthWindowOrientationWidth_Landscape,
            clAuthWindowOrientationHeight: clAuthWindowOrientationHeight_Landscape,

            clAuthWindowOrientationCenterX: clAuthWindowOrientationCenterX_Landscape,
            clAuthWindowOrientationCenterY: clAuthWindowOrientationCenterY_Landscape,

            //控件
            clLayoutLogoWidth: clLayoutLogoWidth_Landscape,
            clLayoutLogoHeight: clLayoutLogoHeight_Landscape,
            clLayoutLogoCenterX: clLayoutLogoCenterX_Landscape,
            clLayoutLogoTop: clLayoutLogoTop_Landscape,

            clLayoutPhoneCenterY: clLayoutPhoneCenterY_Landscape,
            clLayoutPhoneHeight: clLayoutPhoneHeight_Landscape,
            clLayoutPhoneLeft: clLayoutPhoneLeft_Landscape,
            clLayoutPhoneRight: clLayoutPhoneRight_Landscape,

            clLayoutLoginBtnCenterY: clLayoutLoginBtnCenterY_Landscape,
            clLayoutLoginBtnHeight: clLayoutLoginBtnHeight_Landscape,
            clLayoutLoginBtnLeft: clLayoutLoginBtnLeft_Landscape,
            clLayoutLoginBtnRight: clLayoutLoginBtnRight_Landscape,

            clLayoutAppPrivacyLeft: clLayoutAppPrivacyLeft_Landscape,
            clLayoutAppPrivacyRight: clLayoutAppPrivacyRight_Landscape,
            clLayoutAppPrivacyBottom: clLayoutAppPrivacyBottom_Landscape,
            // clLayoutAppPrivacyHeight: clLayoutAppPrivacyHeight_Landscape,

            clLayoutSloganLeft: clLayoutSloganLeft_Landscape,
            clLayoutSloganRight: clLayoutSloganRight_Landscape,
            clLayoutSloganHeight: clLayoutSloganHeight_Landscape,
            clLayoutSloganBottom: clLayoutSloganBottom_Landscape,
        },
        widgets: {
            widget1: {
                // 控件通用属性: '', //
                widgetId: 'customView_one', //字符标记
                type: 'Button', //自定义控件类型：Button：按钮，ImageView:图片 TextView:文本
                // backgroundColor: '', //控件背景色[r,g,b,a]
                // cornerRadius: '', //圆角，设置圆角时请设置masksToBounds:true
                // masksToBounds: '', //圆角相关,设置圆角时请设置true
                // 布局相关属性 通用(相对授权页， 全屏， 从左至右， 从上至下距离为正值， 反之为负值): '', //
                clLayoutTop: otherT + api.safeArea.top, //控件与授权页顶部距离
                clLayoutLeft: clLayoutPhoneLeft_Portrait, //控件与授权页左侧距离
                clLayoutRight: clLayoutPhoneRight_Portrait, //控件与授权页右侧距离，一般为负值
                // clLayoutBottom: '', //控件与授权页底部距离，一般为负值
                // clLayoutWidth: '', //控件宽度
                clLayoutHeight: 19, //控件高度
                // clLayoutCenterX: '', //控件与授权页水平中心偏移量，0:水平居中，正值:中心向右偏移，负值:中心向左偏移
                // clLayoutCenterY: '', //控件与授权页垂直中心偏移量，0:垂直居中，正值:中心向下偏移，负值:中心向上偏移
                // // Button独有属性: '', //
                // navPosition: '', //按钮位置，navleft:添加到导航栏左侧 ，navright:添加到导航栏右侧，不设置默认添加到授权页上，当设置为导航栏控件时，仅宽高可设置，位置固定在导航栏左右标准位置
                textContent: '其他手机号码登入', //文字 String
                textFont: 14, //字体大小
                textColor: [1, 1, 1, 1], //文字颜色[r,g,b,a]
                // image: '', //按钮左侧图片，非背景图，传图片路径
                isFinish: true, //点击后自动关闭授权页
                // TextView独有属性: '', //
                // textContent: '其他手机号码登入', //文字 String
                // textFont: 14, //字体大小
                // textColor: [1, 1, 1, 1], //文字颜色[r,g,b,a]
                // numberOfLines: '', //行数：默认单行， 0:无限，自动换行，其他：指定行数
                // textAlignment: '', //对齐方式，默认居左， 0: center 1: left 2: right
                // ImageView独有属性: '', //
                // image: '', //背景图，传图片路径
            },
            widget2: {
                widgetId: 'customView_two', //字符标记
                type: 'Button', //自定义控件类型：Button：按钮，ImageView:图片 TextView:文本
                // 布局相关属性 通用(相对授权页， 全屏， 从左至右， 从上至下距离为正值， 反之为负值): '', //
                clLayoutTop: qtfsT + api.safeArea.top - 5, //控件与授权页顶部距离
                clLayoutLeft: qtfsL + 5, //控件与授权页左侧距离
                clLayoutWidth: 100, //控件宽度
                // // Button独有属性: '', //
                textContent: '其他方式', //文字 String
                textFont: 11, //字体大小
                textColor: [1, 1, 1, 1], //文字颜色[r,g,b,a]
                isFinish: true, //点击后自动关闭授权页
            },
            widget3: {
                widgetId: 'customView_tri', //字符标记
                type: 'Button', //自定义控件类型：Button：按钮，ImageView:图片 TextView:文本
                // 布局相关属性 通用(相对授权页， 全屏， 从左至右， 从上至下距离为正值， 反之为负值): '', //
                clLayoutTop: qtfsT + api.safeArea.top - 5, //控件与授权页顶部距离
                clLayoutLeft: ydwt - 5, //控件与授权页左侧距离
                clLayoutWidth: 100, //控件宽度
                // // Button独有属性: '', //
                textContent: '遇到问题', //文字 String
                textFont: 11, //字体大小
                textColor: [1, 1, 1, 1], //文字颜色[r,g,b,a]
                isFinish: true, //点击后自动关闭授权页
            },
            widget4: {
                widgetId: 'customView_for', //字符标记
                type: 'ImageView', //自定义控件类型：Button：按钮，ImageView:图片 TextView:文本
                // 布局相关属性 通用(相对授权页， 全屏， 从左至右， 从上至下距离为正值， 反之为负值): '', //
                clLayoutTop: wxBtnT + 25, //控件与授权页顶部距离
                clLayoutLeft: wxBtnL, //控件与授权页左侧距离
                clLayoutWidth: 35, //控件宽度
                clLayoutHeight: 35, //控件高度
                image: 'image/wx@2x.png', //背景图，传图片路径
                isFinish: true, //点击后自动关闭授权页
            },
            widget5: {
                widgetId: 'customView_fiv', //字符标记
                type: 'ImageView', //自定义控件类型：Button：按钮，ImageView:图片 TextView:文本
                // 布局相关属性 通用(相对授权页， 全屏， 从左至右， 从上至下距离为正值， 反之为负值): '', //
                clLayoutTop: wxBtnT + 25, //控件与授权页顶部距离
                clLayoutLeft: qqBtnL, //控件与授权页左侧距离
                clLayoutWidth: 35, //控件宽度
                clLayoutHeight: 35, //控件高度
                image: 'image/qq@2x.png', //背景图，传图片路径
                isFinish: true, //点击后自动关闭授权页
            },
            widget6: {
                widgetId: "customView_three_imageView", //字符标记
                type: "ImageView", // 类型：Button：按钮，ImageView:图片 TextView:文本
                // image: "image/shanyanImg/shanyanlogo1.png",
                backgroundColor: [0, 0, 0, 0], //控件背景色[r,g,b,a]

                cornerRadius: 40, //圆角，设置圆角时请设置masksToBounds:true
                masksToBounds: true, //圆角相关

                clLayoutLeft: 0,
                clLayoutTop: 0,
                clLayoutRight: 0,
                // clLayoutBottom:-280,
                clLayoutWidth: api.winWidth,
                clLayoutHeight: api.winHeight,
                clLayoutCenterX: 0,
                clLayoutCenterY: 0,
                viewLever: 0
            }
        }
    }
}