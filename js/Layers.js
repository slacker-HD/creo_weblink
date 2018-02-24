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

function RefershCurrentWindow() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    session.CurrentWindow.Refresh();
    session.CurrentWindow.Repaint();
    session.CurrentWindow.Activate();
}

function CurrentModel() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    return session.CurrentModel;
}

function CreateLayers() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var model = CurrentModel();
    if (model == null)
        return;
    if (model.Type != pfcCreate("pfcModelType").MDL_DRAWING)
        return;

    var layers = model.ListItems(pfcCreate("pfcModelItemType").ITEM_LAYER);
    for (var i = 0; i < layers.Count; i++) {
        if (layers.Item(i).GetName() == "TABLE" || layers.Item(i).GetName() == "NOTE" || layers.Item(i).GetName() == "DIMENSION" || layers.Item(i).GetName() == "SYMBOL") {
            layers.Item(i).Delete();
        }
    }

    var layer = model.CreateLayer("TABLE");
    var tables = model.ListItems(pfcCreate("pfcModelItemType").ITEM_TABLE);
    for (var i = 0; i < tables.Count; i++) {
        layer.AddItem(tables.Item(i))
    }

    layer = model.CreateLayer("NOTE");
    var notes = model.ListItems(pfcCreate("pfcModelItemType").ITEM_DTL_NOTE);
    for (var i = 0; i < notes.Count; i++) {
        layer.AddItem(notes.Item(i))
    }

    layer = model.CreateLayer("SYMBOL");
    var symbols = model.ListItems(pfcCreate("pfcModelItemType").ITEM_DTL_SYM_INSTANCE);
    for (var i = 0; i < symbols.Count; i++) {
        layer.AddItem(symbols.Item(i))
    }

    layer = model.CreateLayer("DIMENSION");
    var models = model.ListModels();
    for (var i = 0; i < models.Count; i++) {
        var dimensions = model.ListShownDimensions(models.Item(i), pfcCreate("pfcModelItemType").ITEM_DIMENSION);
        for (var j = 0; j < dimensions.Count; j++) {
            layer.AddItem(dimensions.Item(j))
        }
        dimensions = model.ListShownDimensions(models.Item(i), pfcCreate("pfcModelItemType").ITEM_REF_DIMENSION);
        for (var j = 0; j < dimensions.Count; j++) {
            layer.AddItem(dimensions.Item(j))
        }
    }
    RefershCurrentWindow();
    model.Save();
    pfcGetProESession().UIShowMessageDialog("操作完成。", null);

}