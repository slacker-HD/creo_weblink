var SYMNAME = "IMI_QRCODE";
var DOTWIDTH = 1.0;
function init() {
    document.getElementById("currentModel").innerHTML = GetCurrentModelName();
}

function GetCurrentModelName() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    if (session.CurrentModel == null)
        return "--";
    return session.CurrentModel.FileName;
}

function RefershCurrentWindow() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    session.CurrentWindow.Refresh();
    session.CurrentWindow.Repaint();
    session.CurrentWindow.Activate();
}

function CurrentModel() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    return session.CurrentModel;
}

function InsertQRCode() {
    placeQRCode();
}

function CleanSymDef(SymName) {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    var drawing = session.CurrentModel;
    var detailItems = drawing.ListDetailItems(pfcCreate("pfcDetailType").DETAIL_SYM_DEFINITION, null);
    for (var i = 0; i < detailItems.Count; i++) {
        var detailItem = detailItems.Item(i);
        var detailSymbolDefInstructions = detailItem.GetInstructions();
        if (detailSymbolDefInstructions.Name === SymName) {
            detailItem.Delete();
            break;
        }
    }
}

function placeSymInst(symDef) {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    var session = pfcGetProESession();
    var drawing = session.CurrentModel;

    if (drawing.Type != pfcCreate("pfcModelType").MDL_DRAWING)
        return;

    var browserSize = session.CurrentWindow.GetBrowserSize();
    session.CurrentWindow.SetBrowserSize(0.0);

    var point = pfcCreate("pfcPoint3D");
    while (true) {
        var mouse =
            session.UIGetNextMousePick(pfcCreate("pfcMouseButton").MouseButton_nil);

        if (mouse.SelectedButton ==
            pfcCreate("pfcMouseButton").MOUSE_BTN_LEFT) {
            point = mouse.Position;
            break;
        }
        else
            return;
    }

    session.CurrentWindow.SetBrowserSize(browserSize);

    var instrs = pfcCreate("pfcDetailSymbolInstInstructions").Create(symDef);
    var position = pfcCreate("pfcFreeAttachment").Create(point);
    var allAttachments = pfcCreate("pfcDetailLeaders").Create();
    position.AttachmentPoint = point;
    allAttachments.ItemAttachment = position;
    instrs.InstAttachment = allAttachments;
    var symInst = drawing.CreateDetailItem(instrs);
    symInst.Show();
}

function DrawQRCode(QRCodedetailItem) {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    var session = pfcGetProESession();
    var color = pfcCreate("pfcStdColor").COLOR_QUILT;

    document.getElementById("qrcode").innerHTML = "";
    var qrcode = new QRCode(document.getElementById("qrcode"));
    qrcode.clear();
    qrcode.makeCode(document.getElementById("qrcodetext").value);
    var data = qrcode._oQRCode.modules;

    var currentPosX = DOTWIDTH / 2;
    var currentPosY = data.length * DOTWIDTH;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            if (data[i][j] == true) {

                var start = pfcCreate("pfcPoint3D");
                start.Set(0, currentPosX);
                start.Set(1, currentPosY);
                start.Set(2, 0);

                var end = pfcCreate("pfcPoint3D");
                end.Set(0, currentPosX);
                end.Set(1, currentPosY - DOTWIDTH);
                end.Set(2, 0.0);

                var geom = pfcCreate("pfcLineDescriptor").Create(start, end);
                var instrs = pfcCreate("pfcDetailEntityInstructions").Create(geom, null);
                instrs.width = DOTWIDTH;
                var rgb = session.GetRGBFromStdColor(color);
                instrs.Color = rgb;
                QRCodedetailItem.CreateDetailItem(instrs);
            }
            currentPosX += DOTWIDTH;
        }
        currentPosX = DOTWIDTH / 2;
        currentPosY -= DOTWIDTH;
    }
}

function placeQRCode() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    var session = pfcGetProESession();
    var drawing = session.CurrentModel;
    if (drawing.Type != pfcCreate("pfcModelType").MDL_DRAWING)
        return;

    CleanSymDef(SYMNAME);
    var QRCodedetailItem;
    var detailSymbolDefInstructions = pfcCreate("pfcDetailSymbolDefInstructions").Create(SYMNAME);
    QRCodedetailItem = drawing.CreateDetailItem(detailSymbolDefInstructions);
    DrawQRCode(QRCodedetailItem);
    placeSymInst(QRCodedetailItem);
    drawing.Regenerate();
    RefershCurrentWindow();
}