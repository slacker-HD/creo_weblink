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


function HasTable() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var model = CurrentModel();
    if (model == null)
        return false;
    if (model.Type != pfcCreate("pfcModelType").MDL_DRAWING)
        return false;
    var tables = model.ListTables();
    if (tables == null) {
        return false;
    }
    if (tables.Count == 0) {
        return false;
    }
    return true;
}

function TableIDwithBom() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var model = CurrentModel();
    if (HasTable()) {
        var tables = model.ListTables();
        for (var i = 0; i < tables.Count; i++) {
            var table = tables.Item(i);
            for (var j = 1; j <= table.GetRowCount(); j++) {
                for (var k = 1; k <= table.GetColumnCount(); k++) {
                    var tableCell = pfcCreate("pfcTableCell").Create(j, k);
                    cellnote = table.GetCellNote(tableCell);
                    if (cellnote != null) {
                        if (cellnote.Type === pfcCreate("pfcModelItemType").ITEM_DTL_NOTE) {
                            var Instructions = cellnote.GetInstructions(true);
                            var TextLines = Instructions.TextLines;
                            if (TextLines.Item(0).Texts.Count > 0) {
                                if (TextLines.Item(0).Texts.Item(0).Text == "&rpt.index") {
                                    return table.Id;
                                }
                            }
                        }
                    }

                }
            }
        }
    }
    return -1;
}

function GBBalloon() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var model = CurrentModel();
    var session = pfcGetProESession();
    if (model == null)
        return;
    if (model.Type != pfcCreate("pfcModelType").MDL_DRAWING)
        return;
    if (TableIDwithBom() != -1) {

        session.CurrentSelectionBuffer.Clear();
        var selection = pfcCreate("MpfcSelect").CreateModelItemSelection(model.GetTable(TableIDwithBom()), null);
        session.CurrentSelectionBuffer.AddSelection(selection);

        session.RunMacro("GBBALLOON ~ Command `ProCmdDwgTblProperties` ;~ Select `Odui_Dlg_00` `pg_vis_tab` 1 `tab_2`;~ Open `Odui_Dlg_00` `t2.opt_balloon_type`;~ Trigger `Odui_Dlg_00` `t2.opt_balloon_type` `simple`;~ Trigger `Odui_Dlg_00` `t2.opt_balloon_type` `quantity`;~ Trigger `Odui_Dlg_00` `t2.opt_balloon_type` `custom`;~ Close `Odui_Dlg_00` `t2.opt_balloon_type`;~ Select `Odui_Dlg_00` `t2.opt_balloon_type` 1 `custom`;~ FocusOut `Odui_Dlg_00` `t2.opt_balloon_type`;~ Activate `Odui_Dlg_00` `t2.push_browse_balloon_sym`;~ Trail `UI Desktop` `UI Desktop` `DLG_PREVIEW_POST` `file_open`;~ Select `file_open` `Ph_list.Filelist` 1 `GBqiubiao.sym`;~ Command `ProFileSelPushOpen@context_dlg_open_cmd` ;~ Activate `Odui_Dlg_00` `stdbtn_1`;");
    }
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
        var obj = SelectionBuffer.Contents.Item(i).SelItem;
        if (obj.Type == pfcCreate("pfcModelItemType").ITEM_DTL_SYM_INSTANCE) {
            var item = model.GetDetailItem(pfcCreate("pfcDetailType").DETAIL_SYM_INSTANCE, obj.Id);
            var instructions = item.GetInstructions(true);
            if (instructions.AttachOnDefType == pfcCreate("pfcSymbolDefAttachmentType").SYMDEFATTACH_LEFT_LEADER || instructions.AttachOnDefType == pfcCreate("pfcSymbolDefAttachmentType").SYMDEFATTACH_FREE || instructions.AttachOnDefType == pfcCreate("pfcSymbolDefAttachmentType").SYMDEFATTACH_RIGHT_LEADER) {
                instructions.InstAttachment.ItemAttachment.AttachmentPoint.Set(1, MouseStatus.Position.Item(1));
                item.Modify(instructions);
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
        var obj = SelectionBuffer.Contents.Item(i).SelItem;
        if (obj.Type == pfcCreate("pfcModelItemType").ITEM_DTL_SYM_INSTANCE) {
            var item = model.GetDetailItem(pfcCreate("pfcDetailType").DETAIL_SYM_INSTANCE, obj.Id);
            var instructions = item.GetInstructions(true);
            if (instructions.AttachOnDefType == pfcCreate("pfcSymbolDefAttachmentType").SYMDEFATTACH_LEFT_LEADER || instructions.AttachOnDefType == pfcCreate("pfcSymbolDefAttachmentType").SYMDEFATTACH_FREE || instructions.AttachOnDefType == pfcCreate("pfcSymbolDefAttachmentType").SYMDEFATTACH_RIGHT_LEADER) {
                instructions.InstAttachment.ItemAttachment.AttachmentPoint.Set(0, MouseStatus.Position.Item(0));
                item.Modify(instructions);
            }
        }
    }
    model.Regenerate();
}