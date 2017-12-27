function init() {
    document.getElementById("directory").innerHTML = GetWorkDir();
}

function AddParamView() {
    var z;
    z = document.getElementById("tableParams").rows.length - 1;
    var tableRow = document.getElementById("tableParams").insertRow(z + 1);
    var Cell_0 = tableRow.insertCell(0);
    Cell_0.innerHTML = '<input value="' + document.getElementById("paramname").value + '"  readonly="true"/>';
    var Cell_1 = tableRow.insertCell(1);
    Cell_1.innerHTML = '<input value="' + document.getElementById("paramtype").options[document.getElementById("paramtype").options.selectedIndex].text + '"  readonly="true"/>';
    var Cell_2 = tableRow.insertCell(2);
    Cell_2.innerHTML = '<input value="' + document.getElementById("paramvalue").value + '"  readonly="true"/>';
    var Cell_3 = tableRow.insertCell(3);
    Cell_3.innerHTML = "<a href='#' onclick='DelParamView(this.parentNode,this.parentNode.parentNode.rowIndex)'>删除</a>";
    var Cell_4 = tableRow.insertCell(4);
    Cell_4.innerHTML = "<a href='#' onclick='EditParamView(this.parentNode.parentNode)'>修改</a>";
    var Cell_5 = tableRow.insertCell(5);
    Cell_5.innerHTML = "<a href='#' onclick='FinishEditView(this.parentNode.parentNode)'>完成修改</a>";
}

function DelParamView(obj, val) {
    var a = window.confirm("您确定要删除吗？");
    if (a) {
        document.getElementById("tableParams").deleteRow(val);
    } else {
        window.alert("未删除！");
    }
}

function EditParamView(obj) {
    var inp = obj.getElementsByTagName("input");
    for (var i = 0, len = inp.length; i < len; i++) {
        inp[i].readOnly = false;
    }
}

function FinishEditView(obj) {
    var inp = obj.getElementsByTagName("input");
    for (var i = 0, len = inp.length; i < len; i++) {
        inp[i].readOnly = true;
    }
}

function GetWorkDir() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    return session.GetCurrentDirectory();
}

/// creo脑残，dirty work around here
function getrealFilename(filename) {
    var reg = /\.[^\.]+$/.exec(filename);
    if (reg != ".prt") {
        filename = filename.slice(0, filename.length - reg.toString().length)
        var arr = filename.split('\\');
        return arr[arr.length - 1];
    }
}

function DesignateParams() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    var files = session.ListFiles("*.prt", pfcCreate("pfcFileListOpt").FILE_LIST_LATEST, GetWorkDir());
    for (var i = 0; i < files.Count; i++) {
        var mdlDescr = pfcCreate("pfcModelDescriptor").CreateFromFileName(getrealFilename(files.Item(i)));
        var mdl = session.GetModelFromDescr(mdlDescr);
        if (mdl == void null) {
            mdl = session.RetrieveModel(mdlDescr);
        }
        var parameters = mdl.ListParams();
        for (var j = 0; j < parameters.Count; j++) {
            var Parameter = parameters.Item(j);
            try {
                Parameter.IsDesignated = true;
            } catch (err) {}
        }
        mdl.Save();
    }
    session.EraseUndisplayedModels();
    // var dialogoptions = pfcCreate("pfcMessageDialogOptions").Create();
    // dialogoptions.DialogLabel = "提示";
    session.UIShowMessageDialog("参数已全部打勾。", null);
}

function DelParams() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var hasRestrictionparam = false;
    var session = pfcGetProESession();
    var files = session.ListFiles("*.prt", pfcCreate("pfcFileListOpt").FILE_LIST_LATEST, GetWorkDir());
    for (var i = 0; i < files.Count; i++) {
        var mdlDescr = pfcCreate("pfcModelDescriptor").CreateFromFileName(getrealFilename(files.Item(i)));
        var mdl = session.GetModelFromDescr(mdlDescr);
        if (mdl == void null) {
            mdl = session.RetrieveModel(mdlDescr);
        }
        var parameters = mdl.ListParams();
        for (var j = 0; j < parameters.Count; j++) {
            var Parameter = parameters.Item(j);
            try {
                Parameter.Delete();
            } catch (err) {
                hasRestrictionparam = true;
            }
        }
        mdl.Save();
    }
    session.EraseUndisplayedModels();
    // var dialogoptions = pfcCreate("pfcMessageDialogOptions").Create();
    // dialogoptions.DialogLabel = "提示";
    if (hasRestrictionparam == true)
        session.UIShowMessageDialog("操作未能全部完成。存在受限制的参数未删除。", null);
    else
        session.UIShowMessageDialog("操作全部完成。", null);
}



function AddParams() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    var files = session.ListFiles("*.prt", pfcCreate("pfcFileListOpt").FILE_LIST_LATEST, GetWorkDir());
    for (var i = 0; i < files.Count; i++) {
        var mdlDescr = pfcCreate("pfcModelDescriptor").CreateFromFileName(getrealFilename(files.Item(i)));
        var mdl = session.GetModelFromDescr(mdlDescr);
        if (mdl == void null) {
            mdl = session.RetrieveModel(mdlDescr);
        }

        var tab = document.getElementById("tableParams");
        //表格行数
        var rows = tab.rows.length;
        for (var j = 1; j < tab.rows.length; j++) {
            var pName = tab.rows[j].cells[0].childNodes[0].value;
            var pv = createParamValueFromString(tab.rows[j].cells[1].childNodes[0].value, tab.rows[j].cells[2].childNodes[0].value);

            p = mdl.GetParam(pName);
            if (p == void null) {
                mdl.CreateParam(pName, pv);
            } else {
                p.Value = pv;
            }
        }
        mdl.Save();
    }
    session.EraseUndisplayedModels();
    // var dialogoptions = pfcCreate("pfcMessageDialogOptions").Create();
    // dialogoptions.DialogLabel = "提示";
    session.UIShowMessageDialog("操作全部完成。", null);
}


function createParamValueFromString(type, value) {
    if (type == "整形") {
        return pfcCreate("MpfcModelItem").CreateIntParamValue(value);
    } else if (type == "浮点型") {
        return pfcCreate("MpfcModelItem").CreateDoubleParamValue(value);
    } else if (type == "布尔型") {
        if (value.toUpperCase() == "YES" || s.toUpperCase() == "TRUE")
            return pfcCreate("MpfcModelItem").CreateBoolParamValue(true);
        else
            return pfcCreate("MpfcModelItem").CreateBoolParamValue(false);
    } else
        return pfcCreate("MpfcModelItem").CreateStringParamValue(value);
}