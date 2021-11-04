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
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    return session.CurrentModel;
}

function GenQRCode() {
    document.getElementById("qrcode").innerHTML = "";
    var qrcode = new QRCode(document.getElementById("qrcode"));

    qrcode.clear();
    qrcode.makeCode(document.getElementById("qrcodetext").value);
    var data = qrcode._oQRCode.modules;
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            // alert(data[i][j]);
        }
    }
}


function InsertQRCode() {
    placeSymInst();
}



function lineEntityCreate() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    var color = pfcCreate("pfcStdColor").COLOR_QUILT;
    var session = pfcGetProESession();

    /*--------------------------------------------------------------------*\ 
      Get the current drawing & its background view
    \*--------------------------------------------------------------------*/
    var drawing = session.CurrentModel;

    var currSheet = drawing.CurrentSheetNumber;
    var view = drawing.GetSheetBackgroundView(currSheet);

    /*--------------------------------------------------------------------*\ 
       Select the endpoints of the line
    \*--------------------------------------------------------------------*/
    session.CurrentWindow.SetBrowserSize(0.0);

    var left = pfcCreate("pfcMouseButton").MOUSE_BTN_LEFT;
    var mouse1 = session.UIGetNextMousePick(left);
    var start = mouse1.Position;
    var mouse2 = session.UIGetNextMousePick(left);
    var end = mouse2.Position;

    /*--------------------------------------------------------------------*\ 
      Allocate and initialize a curve descriptor 
    \*--------------------------------------------------------------------*/
    var geom = pfcCreate("pfcLineDescriptor").Create(start, end);

    /*--------------------------------------------------------------------*\ 
      Allocate data for the draft entity 
    \*--------------------------------------------------------------------*/
    var instrs = pfcCreate("pfcDetailEntityInstructions").Create(geom,
        view);

    /*--------------------------------------------------------------------*\ 
      Set the color to the specified Pro/ENGINEER predefined color 
    \*--------------------------------------------------------------------*/
    var rgb = session.GetRGBFromStdColor(color);
    instrs.Color = rgb;

    /*--------------------------------------------------------------------*\ 
      Create the entity 
    \*--------------------------------------------------------------------*/
    drawing.CreateDetailItem(instrs);

    /*--------------------------------------------------------------------*\ 
      Display the entity 
    \*--------------------------------------------------------------------*/
    session.CurrentWindow.Repaint();
}



function placeSymInst() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    var session = pfcGetProESession();
    var drawing = session.CurrentModel;
    if (drawing.Type != pfcCreate("pfcModelType").MDL_DRAWING)
        return;

    var detailSymbolDefInstructions = pfcCreate("pfcDetailSymbolDefInstructions").Create("IMI_QRCODE");
    detailSymbolDefInstructions.HasElbow = false;
    var data = qrcode._oQRCode.modules;
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            
        }
    }
    drawing.CreateDetailItem(detailSymbolDefInstructions);
}