function init() {
    document.getElementById("currentModel").innerHTML = GetCurrentModelName();
}

function GetCurrentModelName() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    if (session.CurrentModel == null)
        return "--";
    return session.CurrentModel.FileName;
}

function CurrentModel() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    return session.CurrentModel;
}

function CreateDrawing() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    var session = pfcGetProESession();
    var model = CurrentModel();
    var drawingTemplate = "c_drawing";
    var options = pfcCreate("pfcDrawingCreateOptions");
    options.Append(pfcCreate("pfcDrawingCreateOption").DRAWINGCREATE_DISPLAY_DRAWING);
    var drw = session.CreateDrawingFromTemplate(model.InstanceName, drawingTemplate, model.Descr, options);
}

function CODrawing() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var model = CurrentModel();
    if (model == null)
        return;
    if (model.Type != pfcCreate("pfcModelType").MDL_PART && model.Type != pfcCreate("pfcModelType").MDL_ASSEMBLY)
        return;

    var session = pfcGetProESession();
    var mdlDescr = pfcCreate("pfcModelDescriptor").CreateFromFileName(GetCurrentModelName().slice(0, GetCurrentModelName().length - 4) + ".drw");
    var mdl = session.GetModelFromDescr(mdlDescr);
    if (mdl == void null) {
        try {
            mdl = session.RetrieveModel(mdlDescr);
        } catch (error) {
            if (pfcGetExceptionType(error) == "pfcXToolkitGeneralError") {
                CreateDrawing();
            }
            return;
        }
    }
    var window = session.CreateModelWindow(mdl);
    mdl.Display();
    window.Activate();
}