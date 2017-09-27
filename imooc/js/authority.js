var account = [],
    win = window,
    doc = document;

function login(user) {
    if (!user.username || !user.password) {
        alert("账号或密码不能为空");
        return;
    }
    var DBaccount = win.localStorage.getItem("account");
    DBaccount = JSON.parse(DBaccount);
    var i,
        length = ctProperty(DBaccount);
    for (i = 0; i < length; i++) {
        if (DBaccount["account" + i].username == user.username && DBaccount["account" + i].password == user.password) {
            win.sessionStorage.logged = "1";
            window.location.href = window.location.href;
            return;
        }
    }
    if (!win.sessionStorage.logeed) {

        alert("账号或密码错误");
    }
}

function logout() {
    win.sessionStorage.logged = "0";
    location.reload(true);
}

function ctProperty(obj) {
    var ct = 0;
    for (var a in obj) {
        ct++;
    }
    return ct;
}

function register(user) {
    debugger
    var account = {
        "username": user["register-username"],
        "password": user["register-password"]
    };
    if (!account.username || !account.password) {
        alert("账号或密码不能为空");
        return;
    }
    var DBaccount = win.localStorage.getItem("account");
    if (DBaccount) { //已经有账号注册过了
        DBaccount = JSON.parse(DBaccount);
        var repeat = 0,
            i,
            length = ctProperty(DBaccount);
        for (i = 0; i < length; i++) {
            if (DBaccount["account" + i].username == user["register-username"]) {
                alert("该账号已经被注册了");
                repeat = 1;
                return;
            }
        }
        if (!repeat) {
            DBaccount["account" + i] = {
                "username": account.username,
                "password": account.password
            };
            win.localStorage.account = JSON.stringify(DBaccount);
            login(account);
        }
    } else {
        var a = {
            "account0": {
                "username": account.username,
                "password": account.password
            }
        };
        win.localStorage.setItem("account", JSON.stringify(a));
        login(account);
    }
}