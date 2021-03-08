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

function CreateDiameter(Showtype) {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var model = CurrentModel();
    if (model == null)
        return;
    if (model.Type != pfcCreate("pfcModelType").MDL_DRAWING)
        return;
    if (Showtype == 1)
        pfcGetProESession().RunMacro("gcc ~ Command `ProCmdDwgCrStdNewRefDim` ;#ON ENTITY;@PAUSE_FOR_SCREEN_PICK;@PAUSE_FOR_SCREEN_PICK;@PAUSE_FOR_SCREEN_PICK;#RETURN;~ Timer `UI Desktop` `UI Desktop` `popupMenuRMBTimerCB`;~ Close `rmb_popup` `PopupMenu`;~ Command `ProCmdEditProperties` ;~ Open `mod_dim_new_asynch` `opt_tol_mode`;~ Close `mod_dim_new_asynch` `opt_tol_mode`;~ Select `mod_dim_new_asynch` `opt_tol_mode` 1 `Plus Minus`;~ Update `mod_dim_new_asynch` `inp_ansi_upper_tol` `0.02`;~ FocusOut `mod_dim_new_asynch` `inp_ansi_upper_tol`;~ Update `mod_dim_new_asynch` `inp_ansi_lower_tol` `0`;~ FocusOut `mod_dim_new_asynch` `inp_ansi_lower_tol`;~ Activate `mod_dim_new_asynch` `psh_ok`;~ Command `ProCmdDwgRegenModel` ;#AUTOMATIC;");
    else if (Showtype == 2)
        pfcGetProESession().RunModelRotate("gcc ~ Command `ProCmdDwgCrStdNewRefDim` ;#ON ENTITY;@PAUSE_FOR_SCREEN_PICK;@PAUSE_FOR_SCREEN_PICK;@PAUSE_FOR_SCREEN_PICK;#RETURN;~ Timer `UI Desktop` `UI Desktop` `popupMenuRMBTimerCB`;~ Close `rmb_popup` `PopupMenu`;~ Command `ProCmdEditProperties` ;~ Open `mod_dim_new_asynch` `opt_tol_mode`;~ Close `mod_dim_new_asynch` `opt_tol_mode`;~ Select `mod_dim_new_asynch` `opt_tol_mode` 1 `Plus Minus`;~ Update `mod_dim_new_asynch` `inp_ansi_upper_tol` `0.2`;~ FocusOut `mod_dim_new_asynch` `inp_ansi_upper_tol`;~ Update `mod_dim_new_asynch` `inp_ansi_lower_tol` `-0.1`;~ FocusOut `mod_dim_new_asynch` `inp_ansi_lower_tol`;~ Activate `mod_dim_new_asynch` `psh_ok`;~ Command `ProCmdDwgRegenModel` ;#AUTOMATIC;");
    else if (Showtype == 3)
        pfcGetProESession().RunMacro("gcc ~ Command `ProCmdDwgCrStdNewRefDim` ;#ON ENTITY;@PAUSE_FOR_SCREEN_PICK;@PAUSE_FOR_SCREEN_PICK;@PAUSE_FOR_SCREEN_PICK;#RETURN;~ Timer `UI Desktop` `UI Desktop` `popupMenuRMBTimerCB`;~ Close `rmb_popup` `PopupMenu`;~ Command `ProCmdEditProperties` ;~ Open `mod_dim_new_asynch` `opt_tol_mode`;~ Close `mod_dim_new_asynch` `opt_tol_mode`;~ Select `mod_dim_new_asynch` `opt_tol_mode` 1 `Plus Minus`;~ Update `mod_dim_new_asynch` `inp_ansi_upper_tol` `0.2`;~ FocusOut `mod_dim_new_asynch` `inp_ansi_upper_tol`;~ Update `mod_dim_new_asynch` `inp_ansi_lower_tol` `0`;~ FocusOut `mod_dim_new_asynch` `inp_ansi_lower_tol`;~ Activate `mod_dim_new_asynch` `psh_ok`;~ Command `ProCmdDwgRegenModel` ;#AUTOMATIC;");
    else if (Showtype == 4)
        pfcGetProESession().RunMacro("~ Command `ProCmdDwgCrStdNewRefDim` ;#ON ENTITY;@PAUSE_FOR_SCREEN_PICK;@PAUSE_FOR_SCREEN_PICK;@PAUSE_FOR_SCREEN_PICK;#RETURN;~ Timer `UI Desktop` `UI Desktop` `popupMenuRMBTimerCB`;~ Close `rmb_popup` `PopupMenu`;~ Command `ProCmdEditProperties` ;~ FocusOut `mod_dim_new_asynch` `inp_ansi_upper_tol`;~ Open `mod_dim_new_asynch` `opt_tol_mode`;~ Close `mod_dim_new_asynch` `opt_tol_mode`;~ Select `mod_dim_new_asynch` `opt_tol_mode` 1 `Symmetric`;~ Update `mod_dim_new_asynch` `inp_ansi_pm_tol_value` `0.2`;~ FocusOut `mod_dim_new_asynch` `inp_ansi_pm_tol_value`;~ Activate `mod_dim_new_asynch` `psh_ok`;");
}

function HorizonArrange() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var model = CurrentModel();
    if (model == null)
        return;
    if (model.Type != pfcCreate("pfcModelType").MDL_DRAWING)
        return;
    var SelectionBuffer = pfcGetProESession().CurrentSelectionBuffer;
    if (SelectionBuffer == null)
        return;
    if (SelectionBuffer.Contents == null)
        return;
    var MouseStatus = pfcGetProESession().UIGetNextMousePick(pfcCreate("pfcMouseButton").MOUSE_BTN_LEFT);

    for (i = 0; i < SelectionBuffer.Contents.Count; i++) {
        var dim2ds, j, pos;
        var dimension = SelectionBuffer.Contents.Item(i).SelItem;
        if (dimension.Type == pfcCreate("pfcModelItemType").ITEM_DIMENSION) {
            dim2ds = model.ListShownDimensions(CurrentModel().GetCurrentSolid(), pfcCreate("pfcModelItemType").ITEM_DIMENSION);
            for (j = 0; j < dim2ds.Count; j++) {
                if (dim2ds.Item(j).id == dimension.Id) {
                    pos = MouseStatus.Position;
                    pos.Set(0, dim2ds.Item(j).Location.Item(0));
                    pos.Set(1, MouseStatus.Position.Item(1));
                    pos.Set(2, dim2ds.Item(j).Location.Item(2));
                    dim2ds.Item(j).Location = pos;
                    break;
                }
            }
        } else if (dimension.Type == pfcCreate("pfcModelItemType").ITEM_REF_DIMENSION) {
            dim2ds = model.ListShownDimensions(CurrentModel().GetCurrentSolid(), pfcCreate("pfcModelItemType").ITEM_REF_DIMENSION);
            for (j = 0; j < dim2ds.Count; j++) {
                if (dim2ds.Item(j).id == dimension.Id) {
                    pos = MouseStatus.Position;
                    pos.Set(0, dim2ds.Item(j).Location.Item(0));
                    pos.Set(1, MouseStatus.Position.Item(1));
                    pos.Set(2, dim2ds.Item(j).Location.Item(2));
                    dim2ds.Item(j).Location = pos;
                    break;
                }
            }
        }
    }
    model.Regenerate();
}

function VerticalArrange() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var model = CurrentModel();
    if (model == null)
        return;
    if (model.Type != pfcCreate("pfcModelType").MDL_DRAWING)
        return;
    var SelectionBuffer = pfcGetProESession().CurrentSelectionBuffer;
    if (SelectionBuffer == null)
        return;
    if (SelectionBuffer.Contents == null)
        return;
    var MouseStatus = pfcGetProESession().UIGetNextMousePick(pfcCreate("pfcMouseButton").MOUSE_BTN_LEFT);
    for (i = 0; i < SelectionBuffer.Contents.Count; i++) {
        var dimension = SelectionBuffer.Contents.Item(i).SelItem;
        var dim2ds, j, pos;
        if (dimension.Type == pfcCreate("pfcModelItemType").ITEM_DIMENSION) {
            dim2ds = model.ListShownDimensions(CurrentModel().GetCurrentSolid(), pfcCreate("pfcModelItemType").ITEM_DIMENSION);
            for (j = 0; j < dim2ds.Count; j++) {
                if (dim2ds.Item(j).id == dimension.Id) {
                    pos = MouseStatus.Position;
                    pos.Set(0, MouseStatus.Position.Item(0));
                    pos.Set(1, dim2ds.Item(j).Location.Item(1));
                    pos.Set(2, dim2ds.Item(j).Location.Item(2));
                    dim2ds.Item(j).Location = pos;
                    break;
                }
            }
        } else if (dimension.Type == pfcCreate("pfcModelItemType").ITEM_REF_DIMENSION) {
            dim2ds = model.ListShownDimensions(CurrentModel().GetCurrentSolid(), pfcCreate("pfcModelItemType").ITEM_REF_DIMENSION);
            for (j = 0; j < dim2ds.Count; j++) {
                if (dim2ds.Item(j).id == dimension.Id) {
                    pos = MouseStatus.Position;
                    pos.Set(0, MouseStatus.Position.Item(0));
                    pos.Set(1, dim2ds.Item(j).Location.Item(1));
                    pos.Set(2, dim2ds.Item(j).Location.Item(2));
                    dim2ds.Item(j).Location = pos;
                    break;
                }
            }
        }
    }
    model.Regenerate();
}

function Dims2Csv() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var model = CurrentModel();
    if (model == null)
        return;
    if (model.Type != pfcCreate("pfcModelType").MDL_DRAWING)
        return;
    var Tolerance;
    var text = "尺寸名\t显示值\t公差显示方式\t公差值\t是否显示\n";
    var dim2ds = model.ListShownDimensions(CurrentModel().GetCurrentSolid(), pfcCreate("pfcModelItemType").ITEM_DIMENSION);
    for (var j = 0; j < dim2ds.Count; j++) {
        text += dim2ds.Item(j).GetName() + "\t" + dim2ds.Item(j).DimValue + "\t";
        Tolerance = dim2ds.Item(j).GetTolerance();
        if (Tolerance == null)
            text += "/\t/\t";
        else {
            switch (Tolerance.Type) {
                case pfcCreate("pfcDimToleranceType").DIMTOL_LIMITS:
                    text += "限制" + "\t(" + Tolerance.LowerLimit + "," + Tolerance.UpperLimit + ")\t";
                    break;
                case pfcCreate("pfcDimToleranceType").DIMTOL_SYMMETRIC:
                    text += " +- 对称" + "\t(±" + Tolerance.Value + ")\t";
                    break;
                case pfcCreate("pfcDimToleranceType").DIMTOL_SYMMETRIC_SUPERSCRIPT:
                    text += " +- 对称(上标)" + "\t(±" + Tolerance.Value + ")\t";
                    break;
                case pfcCreate("pfcDimToleranceType").DIMTOL_PLUS_MINUS:
                    text += "正-负" + "\t(" + Tolerance.Minus + "," + Tolerance.Plus + ")\t";
                    break;
                case pfcCreate("pfcDimToleranceType").DIMTOL_PLUS_MINUS:
                    text += "正-负" + "\t(" + Tolerance.Minus + "," + Tolerance.Plus + ")\t";
                    break;
                case pfcCreate("pfcDimToleranceType").DIMTOL_ISODIN:
                    text += "公差表" + "\t" + Tolerance.TableName + Tolerance.TableColumn + "\t";
                    break;
                default:
                    text += "/\t/\t";
                    break;
            }
        }
        text += dim2ds.Item(j).IsDisplayed + "\n";
    }


    dim2ds = model.ListShownDimensions(CurrentModel().GetCurrentSolid(), pfcCreate("pfcModelItemType").ITEM_REF_DIMENSION);
    for (j = 0; j < dim2ds.Count; j++) {
        text += dim2ds.Item(j).GetName() + "\t" + dim2ds.Item(j).DimValue + "\t";
        Tolerance = dim2ds.Item(j).GetTolerance();
        if (Tolerance == null)
            text += "/\t/\t";
        else {
            switch (Tolerance.Type) {
                case pfcCreate("pfcDimToleranceType").DIMTOL_LIMITS:
                    text += "限制" + "\t(" + Tolerance.LowerLimit + "," + Tolerance.UpperLimit + ")\t";
                    break;
                case pfcCreate("pfcDimToleranceType").DIMTOL_SYMMETRIC:
                    text += " +- 对称" + "\t(±" + Tolerance.Value + ")\t";
                    break;
                case pfcCreate("pfcDimToleranceType").DIMTOL_SYMMETRIC_SUPERSCRIPT:
                    text += " +- 对称(上标)" + "\t(±" + Tolerance.Value + ")\t";
                    break;
                case pfcCreate("pfcDimToleranceType").DIMTOL_PLUS_MINUS:
                    text += "正-负" + "\t(" + Tolerance.Minus + "," + Tolerance.Plus + ")\t";
                    break;
                case pfcCreate("pfcDimToleranceType").DIMTOL_PLUS_MINUS:
                    text += "正-负" + "\t(" + Tolerance.Minus + "," + Tolerance.Plus + ")\t";
                    break;
                case pfcCreate("pfcDimToleranceType").DIMTOL_ISODIN:
                    text += "公差表" + "\t" + Tolerance.TableName + Tolerance.TableColumn + "\t";
                    break;
                default:
                    text += "/\t/\t";
                    break;
            }
        }
        text += dim2ds.Item(j).IsDisplayed + "\n";
    }






    var w = window.open("about:blank", "导出", "height=0,width=0,toolbar=no,menubar=no,scrollbars=no,resizable=on,location=no,status=no");
    w.document.write(text);
    try {
        w.document.charset = "GB2312";
    } catch (err) {}
    w.document.execCommand("SaveAs", false, model.FullName + ".csv");
    w.close();
}


function dataToTxt(exportData) {

    var w = window.open("about:blank", "导出", "height=0,width=0,toolbar=no,menubar=no,scrollbars=no,resizable=on,location=no,status=no");
    var dt = new Date();
    w.document.write(exportData);
    try {
        w.document.charset = "GB2312";
    } catch (err) {}
    w.document.execCommand("SaveAs", false, dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + "-" + dt.getTime() + ".txt");
    w.close();
}