var Timer = null;

function init() {
    document.getElementById("fileopen").innerHTML = GetCurrentModelName();
}

function GetCurrentModelName() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    if (session.CurrentModel == null)
        return "--";
    return session.CurrentModel.FileName;
}


function ModelRotate(RotateAxis) {
    var modeltype = pfcCreate("pfcModelType");
    var session = pfcGetProESession();
    var model = session.CurrentModel;

    if (model == null || model.type != modeltype.MDL_PART && model.Type != modeltype.MDL_ASSEMBLY) {
        alert("本功能只能在零件或组件状态下使用");
        return;
    }
    if (Timer == null) {
        var currentwindow = session.CurrentWindow;
        Timer = setInterval(function () {
            model.GetCurrentView().rotate(RotateAxis, -3);
            currentwindow.Repaint();
        }, 100);
    } else {
        clearInterval(Timer);
        Timer = null;
    }
}

function RotateX() {
    var axis = pfcCreate("pfcCoordAxis");
    ModelRotate(axis.COORD_AXIS_X);
}

function RotateY() {
    var axis = pfcCreate("pfcCoordAxis");
    ModelRotate(axis.COORD_AXIS_Y);
}

function RotateZ() {
    var axis = pfcCreate("pfcCoordAxis");
    ModelRotate(axis.COORD_AXIS_Z);
}