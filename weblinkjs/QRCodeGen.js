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

function GenQRCode() {
    document.getElementById("qrcode").innerHTML = "";
    var qrcode = new QRCode(document.getElementById("qrcode"));

    qrcode.clear();
    qrcode.makeCode(document.getElementById("qrcodetext").value);
    var data = qrcode._oQRCode.modules;
    // for (var i = 0; i < data.length; i++) {
    //     for (var j = 0; j < data[i].length; j++) {
    //         // alert(data[i][j]);
    //     }
    // }
}


function InsertQRCode() {

}