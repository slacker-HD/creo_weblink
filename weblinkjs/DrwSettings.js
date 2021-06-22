function init() {
    document.getElementById("directory").innerHTML = GetWorkDir();
    AddListView(".drw");
}

var dtlfile = "";
function GetWorkDir() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    return session.GetCurrentDirectory();
}

function selectdtl() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    try {
        var path = session.UIOpenFile(pfcCreate('pfcFileOpenOptions').Create("*.dtl"));
        document.getElementById("dtlfile").innerHTML = path;
        dtlfile = path;
    } catch (error) {

    }
}

function getrealFilename(filename, extension) {
    var reg = /\.[^\.]+$/.exec(filename);
    var arr;
    if (reg != extension) {
        filename = filename.slice(0, filename.length - reg.toString().length);
        arr = filename.split('\\');
        return arr[arr.length - 1];
    } else {
        arr = filename.split('\\');
    }
    return arr[arr.length - 1];
}

function AddListView(extension) {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    var files = session.ListFiles("*" + extension, pfcCreate("pfcFileListOpt").FILE_LIST_LATEST, GetWorkDir());
    for (var i = 0; i < files.Count; i++) {
        var z;
        z = document.getElementById(extension).rows.length - 1;
        var tableRow = document.getElementById(extension).insertRow(z + 1);
        var Cell_0 = tableRow.insertCell(0);
        Cell_0.innerHTML = document.getElementById(extension).rows.length;
        var Cell_1 = tableRow.insertCell(1);
        Cell_1.innerHTML = files.Item(i);
        var Cell_2 = tableRow.insertCell(2);
        Cell_2.innerHTML = '<input type="checkbox" checked="true" />';
    }
}

function DrwOptionMacroString(drwfile, dtlfile) {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    drwfile = drwfile.split("\\").join("\\\\");
    dtlfile = dtlfile.split("\\").join("\\\\");
    alert(drwfile);
    return ("~ Command `ProCmdModelOpen` ;~ Trail `UI Desktop` `UI Desktop` `DLG_PREVIEW_POST` `file_open`;~ Update `file_open` `Inputname` `" + drwfile + "`;~ Activate `file_open` `Inputname`;~ Select `main_dlg_cur` `appl_casc`;~ Activate `main_dlg_cur` `main_dlg_cur`;~ Close `main_dlg_cur` `appl_casc`;~ Command `ProCmdDwgProperties` ;~ Activate `mdlprops_dlg` `OPTIONS_lay_Controls.push_Change.lay_instance`;~ FocusOut `preferences` `InputOpt`;~ Activate `preferences` `Open`;~ Trail `UI Desktop` `UI Desktop` `DLG_PREVIEW_POST` `file_open`;~ Update `file_open` `Inputname` `" + dtlfile + "`;~ Activate `file_open` `Inputname`;~ Activate `preferences` `ApplySave`;~ FocusOut `preferences` `InputOpt`;~ Activate `preferences` `Close`;~ Activate `mdlprops_dlg` `DlgClose_push`;~ Command `ProCmdModelSave` ;~ Activate `file_saveas` `OK`;");
}

function MassReplace() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var trs = document.getElementById(".drw").getElementsByTagName("tr");
    var session = pfcGetProESession();
    if (dtlfile === "") {
        session.UIShowMessageDialog("请先选择dtl文件。", null);
        return;
    }
    var macro = "IMI ";
    session.UIShowMessageDialog("准备开始批量更换图框，受weblink功能限制，系统无法判断是否全部完成设置，请操作完成后手工确认。", null);
    for (var i = 0; i < trs.length; i++) {
        var tds = trs[i].getElementsByTagName("td");
        if (tds[2].childNodes[0].checked === true) {
            macro += DrwOptionMacroString(tds[1].innerText, dtlfile);
        }
    }
    session.RunMacro(macro);
}