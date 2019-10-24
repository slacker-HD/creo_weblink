function init() {
    document.getElementById("currentModel").innerHTML = GetCurrentModelName();
    document.getElementById("famcontents").innerHTML = "";
    if (document.getElementById("currentModel").innerHTML !== "--") {
        document.getElementById("instancenumber").innerHTML = "共有实例" + GetInstancesNumber() + "个";
        var wpwl = pfcGetScript();
        var names = wpwl.pwlFamtabInstancesGet(document.getElementById("currentModel").innerHTML);
        if (names !== null) {
            for (var i = 0; i < names.InstanceNames.Count; i++) {
                AddFamcontentView(names.InstanceNames.Item(i));
            }
        }
    } else {
        document.getElementById("instancenumber").innerHTML = "";
    }
}


function AddFamcontentView(name) {
    var z;
    z = document.getElementById("famcontents").rows.length - 1;
    var tableRow = document.getElementById("famcontents").insertRow(z + 1);
    var Cell_0 = tableRow.insertCell(0);
    Cell_0.innerHTML = '<input type="checkbox" checked="true" />';
    var Cell_1 = tableRow.insertCell(1);
    Cell_1.innerHTML = document.getElementById("famcontents").rows.length;
    var Cell_2 = tableRow.insertCell(2);
    Cell_2.innerHTML = name;
    var Cell_3 = tableRow.insertCell(3);
    Cell_3.innerHTML = "--";
}

function GetCurrentModelName() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    if (session.CurrentModel == null)
        return "--";
    return session.CurrentModel.FileName;
}

function GetInstancesNumber() {
    var model = CurrentModel();
    if (model == null)
        return;
    if (model.Type != pfcCreate("pfcModelType").MDL_PART)
        return;
    var wpwl = pfcGetScript();
    var names = wpwl.pwlFamtabInstancesGet(model.FileName);
    return names.NumInstances;
}

function CurrentModel() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    return session.CurrentModel;
}

function FamExport() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    var model = CurrentModel();
    if (model == null)
        return;
    if (model.Type != pfcCreate("pfcModelType").MDL_PART)
        return;

    var session = pfcGetProESession();
    try {
        var path = session.UISelectDirectory(pfcCreate('pfcDirectorySelectionOptions').Create());
        session.ChangeDirectory(path);
        var wpwl = pfcGetScript();
        var names = wpwl.pwlFamtabInstancesGet(model.FileName);
        if (names !== null) {
            for (var i = 0; i < names.InstanceNames.Count; i++) {
                if (document.getElementById("famcontents").rows[i].cells[0].childNodes[0].checked == true) {
                    var InstanceOpen = wpwl.pwlInstanceOpen(model.FileName, names.InstanceNames.Item(i), false);
                    var saveops = wpwl.pwlMdlSaveAs(names.InstanceNames.Item(i) + ".prt", null, "IMI_export_" + names.InstanceNames.Item(i) + ".prt");
                    if (saveops.Status == true)
                        document.getElementById("famcontents").rows[i].cells[3].innerHTML = "已成功导出。";
                    else
                        document.getElementById("famcontents").rows[i].cells[3].innerHTML = "导出失败";
                }
            }
        }
    } catch (error) {

    }
}