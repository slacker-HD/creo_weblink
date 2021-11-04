function init() {
    document.getElementById("directory").innerHTML = GetWorkDir();
    initlist();
}

function initlist() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    var dirlist = document.getElementById("dirlist");
    var i;
    dirlist.innerHTML = "";
    var dirval = getCookie('IMICreoCurDir');
    if (dirval !== null) {
        var dirs = dirval.split("\n");
        for (i = 0; i < dirs.length; i++) {
            if (dirs[i] === "") {
                dirs.splice(i, 1);
            }
        }
        for (i = 0; i < dirs.length; i++) {
            var newRow = dirlist.insertRow();
            var newCell0 = newRow.insertCell();
            var newCell1 = newRow.insertCell();
            var newCell2 = newRow.insertCell();
            newCell0.innerHTML = i + 1;
            newCell1.innerHTML = dirs[i];
            newCell2.innerHTML = "<a href='#' onclick='DelDir(this.parentNode.parentNode.cells[1].innerHTML)'>删除</a>";
        }
        Array.prototype.forEach.call(dirlist.getElementsByTagName('tr'), function (tr) {
            var sbgc = "";
            tr.addEventListener('mouseover', function (event) {
                sbgc = tr.style.backgroundColor;
                tr.style.backgroundColor = "rgb(216,226,235)";
                tr.style.cursor = "pointer";
            });
            tr.addEventListener('mouseout', function (event) {
                tr.style.backgroundColor = sbgc;
            });
            tr.addEventListener('dblclick', function (event) {
                session.ChangeDirectory(tr.cells[1].innerHTML);
                document.getElementById("directory").innerHTML = tr.cells[1].innerHTML;
            });
        });
    }
}

function GetWorkDir() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    return session.GetCurrentDirectory();
}

function DirIsRecord(Dir) {
    var dirval = getCookie('IMICreoCurDir');
    if (dirval !== null) {
        var dirs = dirval.split("\n");
        for (var i = 0; i < dirs.length; i++) {
            if (Dir.toLocaleLowerCase() === dirs[i].toLocaleLowerCase()) {
                return true;
            }
        }
    }
    return false;
}

function AddDir() {
    if (!DirIsRecord(document.getElementById("directory").innerHTML)) {
        if (getCookie('IMICreoCurDir') !== null) {
            if (getCookie('IMICreoCurDir') === "") {
                setCookie('IMICreoCurDir', document.getElementById("directory").innerHTML);
            } else {
                setCookie('IMICreoCurDir', getCookie('IMICreoCurDir') + "\n" + document.getElementById("directory").innerHTML);
            }
        } else {
            setCookie('IMICreoCurDir', document.getElementById("directory").innerHTML);
        }
    }
    initlist();
}


function DelDir(Dir) {
    var a = window.confirm("您确定要删除吗？");
    if (a) {
        var dirval = getCookie('IMICreoCurDir');
        if (dirval !== null) {
            var i;
            var dirs = dirval.split("\n");
            for (i = 0; i < dirs.length; i++) {
                if (Dir.toLocaleLowerCase() === dirs[i].toLocaleLowerCase() ||
                    dirs[i] == "") {
                    dirs.splice(i, 1);
                }
            }
            dirval = "";
            for (i = 0; i < dirs.length; i++) {
                dirval += dirs[i] + "\n";
            }
            setCookie("IMICreoCurDir", dirval);

        } else {
            setCookie("IMICreoCurDir", "");
        }
        initlist();
    }


}


function setCookie(name, value) {
    document.cookie = name + "=" + escape(value) + ";expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    arr = document.cookie.match(reg);
    if (arr !== null) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}