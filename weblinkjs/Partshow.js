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

function CurrentModel() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    return session.CurrentModel;
}

function HideSelected() {
    var session = pfcGetProESession();
    session.RunMacro("~ Command `ProCmdViewExclude`");
}

function HideUnSelected() {
    var session = pfcGetProESession();
    session.RunMacro("~ Command `ProCmdViewNormalMaster`");
}

function Restore() {
    var session = pfcGetProESession();
    try {
        var Model = CurrentModel();
        var MasterRep = Model.GetActiveSimpRep();
        Model.DeleteSimpRep(MasterRep);
    } catch (error) {
    }
    session.RunMacro("~ Command `ProCmdViewVisTool` ;~ Activate `visual_dlg0` `CloseBtn`;");
}