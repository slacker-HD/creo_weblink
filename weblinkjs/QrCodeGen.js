function init() {
    // document.getElementById("currentModel").innerHTML = GetCurrentModelName();
}

function GetCurrentModelName() {
    // if (pfcIsMozilla())
    //     netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    // var session = pfcGetProESession();
    // if (session.CurrentModel == null)
    //     return "--";
    // return session.CurrentModel.FileName;
}

function RefershCurrentWindow() {
    // if (pfcIsMozilla())
    //     netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    // var session = pfcGetProESession();
    // session.CurrentWindow.Refresh();
    // session.CurrentWindow.Repaint();
    // session.CurrentWindow.Activate();
}

function CurrentModel() {
    // if (pfcIsMozilla())
    //     netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    // var session = pfcGetProESession();
    // return session.CurrentModel;
}

function makeCode() {
    document.getElementById("qrcode").innerHTML = "";
    var qrcode = new QRCode(document.getElementById("qrcode"));
    qrcode.clear();
    qrcode.makeCode("fdsafdsaf");
    // var a = qrcode.toString('http://www.google.com', function (err, string) {
    //     if (err) throw err;
    //     console.log(string);
    // });


    QRCode.toString('I am a pony!', function (err, url) {
        if (err) alert(err);
        alert(url);
    });

}


