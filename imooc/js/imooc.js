! function(window) {
    var G_data = {},
        logged = window.sessionStorage.logged || 0,
        getUrl = "getData/getClassesInfo",
        setUrl = "setData/setUser";

    function init() {
        getData(getUrl, G_data, function(res) {
            G_data = res;
            initHtml();
            initEvent();
        });
    }

    function getData(url, data, handler) {
        $.ajax({
            type: "get",
            url: url,
            cache: "false",
            dataType: "json",
            success: handler,
            error: dataTransformError
        });
    }

    function setData(url, data, handeler) {
        $.ajax({
            type: "post",
            url: url,
            cache: "false",
            dataType: "json",
            scriptCharset: 'utf-8',
            success: handler,
            error: dataTransformError
        });
    }

    function dataTransformError(ss, textStatus, errorThrown) {
        console.log(ss);
        console.log(textStatus);
        console.log(errorThrown);
        alert("Error when transforming datas");
        return false;
    }

    function initEvent() {
        // page main content react logic
        $(".class-card").on("mouseenter", reactLogic.classActive);
        reactLogic.classActive.apply($(".card-active")); //初始化
        $("#headSearch").on("focus", reactLogic.hideSearch);
        $("#headSearch").on("blur", reactLogic.showSearch);
        $(".shop-cart,.shopping-cart").on("mouseenter", reactLogic.showShoppingCart);
        $(".shop-cart,.shopping-cart").on("mouseleave", reactLogic.hideShoppingCart);
        $(".headJpg,.selfInfo").on("mouseenter", { action: "show" }, reactLogic.selfInfo);
        $(".headJpg,.selfInfo").on("mouseleave", { action: "hide" }, reactLogic.selfInfo);
        $(".chooseClass").on("click", reactLogic.chooseClass);
        $(".rightLi5").on("click", function() {
            $("body")[0].scrollTop = 0;
        });

        $(window).scroll(function() {
            var top = $(window).scrollTop();
            if (top > 100) {
                $(".rightLi5").css("display", "block");
            } else {
                $(".rightLi5").css("display", "none");
            }
        });
        // var scrollTop;
        // setInterval(function() {
        //     scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        //     if (scrollTop > 100) {
        //         $(".rightLi5").css("display", "block");
        //     } else {
        //         $(".rightLi5").css("display", "none");
        //     }
        // }, 100);


        //login modal react logic

        $("#login").on("click", function() {
            loginLogic.showLoginModal();
            loginLogic.login();
        });
        $("#login-button").on("click", function() {
            var data = {};
            $("form[name=login-form]").find("input").each(function() {
                data[$(this).attr("name")] = $(this).val();
            });
            login(data);
        });

        $("#register").on("click", function() {
            loginLogic.showLoginModal();
            loginLogic.register();
        });
        $("#register-button").on("click", function() {
            debugger
            var data = {};
            $("form[name=register-form]").find("input").each(function() {
                data[$(this).attr("name")] = $(this).val();
            });
            register(data);
        });

        $("#logout").on("click", logout);
        $(".modal-close").on("click", loginLogic.hideLoginModal);
        $(".h-login").on("click", loginLogic.login);
        $(".h-register").on("click", loginLogic.register);
    }

    function initHtml() {
        var a = document.cookie.split(";");
        for (var prop in a) {
            if (a[prop].indexOf("logged") > -1 && a[prop].indexOf("1") > -1) {
                logged = 1;
            }
        }

        if (win.sessionStorage.logged == "1") {
            $("#login,#register").css("display", "none");
            $("#bell,#headJpg").css("display", "inline-block");
        } else {
            $("#login,#register").css("display", "inline-block");
            $("#bell,#headJpg").css("display", "none");
        }
        var i;
        for (var prop in initPageLogic) {
            initPageLogic[prop]();
        }


        //	initClassesPanel();
    }
    
    var util = { //公用的一些工具函数  模板
        cardTemplate: function(obj) {
            var html = '<div class="class-card"><div class="card-1"><div class="card-1-head">' +
                obj.title + '</div><div class="card-1-foot"><p class="l">' +
                obj.learnNumber + '人在学</p><p class="r">￥' +
                obj.price + '</p></div></div>' +
                '<div class="card-2"><div class="card-2-head"><i class="fa fa-play-circle"></i>实战课程</div><div class="card-2-content"><h2>' +
                obj.title + '</h2><p>' +
                obj.descrip + '</p></div><div class="card-2-foot"><p class="l">' +
                obj.learnNumber + '人在学</p><p class="r">￥' +
                obj.price + '</p></div></div></div>';
            return html;
        },
        cardPanelTemplate: function(obj) {
            var html = '<div class="class-panel"><div class="panel-head"><img src="' +
                obj.imgSrc + '"><div class="label-div"><label>';
            if (obj.smallLabel[1]) {
                html += obj.smallLabel[0] + '</label><label>' +
                    obj.smallLabel[1] + '</label></div></div><div class="panel-body"><h3>';
            } else {
                html += obj.smallLabel[0] + '</label></div></div><div class="panel-body"><h3>';
            }
            html += obj.title + '</h3><div class="panel-content"><p>' +
                obj.prioty + '&nbsp;&nbsp;<i class="fa fa-user"></i>' +
                obj.learnNumber + '</p><p>' +
                obj.decrip + '</p></div></div></div>';
            return html;
        }
    };

    //初始化资源相关逻辑
    var initPageLogic = {
        initRecentSearch: function() { //导航栏最近搜索数据
            var i,
                html = " ",
                prop = G_data.navigation.recentSearch,
                length = prop.length;
            for (i = 0; i < length; i++) {
                html += "<li>";
                html += prop[i] + "</li>";
            }
            $("#recentSearch").children("ul").append(html);
        },
        initSearchBox: function() { //导航栏搜索的两个块
            var i,
                html = "",
                prop = G_data.navigation.searchBox,
                length = prop.length;
            for (i = 0; i < length; i++) {
                html += "<a href='#''>";
                html += prop[i] + "</a>";
            }
            $("#search-box").append(html);
        },
        initPersonInfo: function() { // 个人信息
            var prop = G_data.navigation.personInfo;
            var $b = $(".infoDetail").find("b");
            $b[0].innerHTML = prop["experience"];
            $b[1].innerHTML = prop["score"];
        },
        initClassNav: function() {
            var i,
                con,
                html = "",
                prop = G_data.classNavigation,
                length = 0; //因为prop是对象不是数组
            for (property in prop) {
                length++;
            }
            for (con = 1; con <= length; con++) {
                var obj = prop["content" + con];
                html = "";
                for (i = 0; i < obj.length; i++) {
                    html += "<dd>" + obj[i] + "</dd>";
                }
                $(".content-" + con).find("dl").append(html);
            }
        },
        initCardFour: function() {
            var i,
                con,
                html = "",
                prop = G_data.classCard.cardFour,
                length = prop.length;
            for (i = 0; i < length; i++) {
                html = "";
                html += util.cardTemplate(prop[i]);
                $(".class-four").append(html);
            }
            $(".class-four").children().eq(0).addClass("card-active");
        },
        initClassCard: function() {
            var i,
                con,
                html = "",
                prop = G_data.classCard.classPanel,
                length = prop.length;
            for (i = 0; i < length; i++) {
                html = "";
                html += util.cardPanelTemplate(prop[i]);
                $(".class-content").append(html);
            }
        }
    };

    //登录相关逻辑
    var loginLogic = {
        showLoginModal: function() {
            $(".loginModal").removeClass("none");
        },
        hideLoginModal: function() {
            $(".loginModal").addClass("none");
        },
        login: function() {
            $(".login-body").removeClass("none");
            $(".register-body").addClass("none");
            $(".h-login").addClass("h-active");
            $(".h-register").removeClass("h-active");
        },
        logout: function() {

        },
        register: function() {
            $(".login-body").addClass("none");
            $(".register-body").removeClass("none");
            $(".h-login").removeClass("h-active");
            $(".h-register").addClass("h-active");
        }
    };

    //将关于页面交互逻辑的函数都写在logic对象里
    var reactLogic = {
        chooseClass: function() {
            var $this = $(this);
            if ($this.hasClass("unchecked")) {
                $this.removeClass("unchecked");
                $this.addClass("checked");
            } else {
                $this.addClass("unchecked");
                $this.removeClass("checked");
            }
        },
        classActive: function() {
            var $this = $(this);
            var $pre = $(".card-active");
            $pre.children(".card-1").css({ "display": "block", "height": "91px" });
            $pre.children(".card-2").css({ "display": "none", "height": "0" });
            $pre.css({ "background": "", "background-size": "" });
            $pre.removeClass("card-active");
            $this.css({
                "background": "url(./images/codingbg.png) no-repeat",
                "background-size": "cover"
            });
            $this.addClass("card-active");
            $this.children(".card-1").css({ "display": "none", "height": "0" });
            $this.children(".card-2").css({ "display": "block", "height": "226px" });
        },
        hideSearch: function() {
            var $this = $(this);
            $this.parent().find("a").css("display", "none");
            $this.parent().children(".searchUl").css("display", "block");
        },
        showSearch: function() {
            var $this = $(this);
            $this.parent().find("a").css("display", "inline-block");
            $this.parent().children(".searchUl").css("display", "none");
        },
        showShoppingCart: function() {
            $(".shopping-cart").css("display", "block");
        },
        hideShoppingCart: function() {
            $(".shopping-cart").css("display", "none");
        },
        selfInfo: function(event) {
            if (event.data.action == "show") {
                $(".selfInfo").css("display", "block").removeClass("none");
            } else {
                $(".selfInfo").css("display", "none").addClass("none");
            }
        }

    };

    init();
}(window);