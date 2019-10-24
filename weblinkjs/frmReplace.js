function init() {
    document.getElementById("directory").innerHTML = GetWorkDir();
    AddListView(".drw");
}

function GetWorkDir() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    return session.GetCurrentDirectory();
}

function selectdrmdir() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    try {
        var path = session.UISelectDirectory(pfcCreate('pfcDirectorySelectionOptions').Create());
        document.getElementById("frmdirectory").innerHTML = path;
        var frms = getfrms(path);
        var trs = document.getElementById(".drw").getElementsByTagName("tr");
        for (var i = 0; i < trs.length; i++) {
            var tds = trs[i].getElementsByTagName("td");
            var frmselect = tds[3].getElementsByTagName("select")[0];
            frmselect.options.length = 1;
            for (var l = 0; l < frms.length; l++) {
                frmselect.options.add(new Option(frms[l], l + 1));
            }

        }
    } catch (error) {

    }
}

function DeleteOptions() {
    var obj = document.getElementsByTagName("select")[0];
    var selectOptions = obj.options;
    var optionLength = selectOptions.length;
    for (var i = 0; i < optionLength; i++) {
        obj.removeChild(selectOptions[0]);
    }
}


function getrealFilename(filename, extension) {
    var reg = /\.[^\.]+$/.exec(filename);
    var arr;
    if (reg != extension) {
        filename = filename.slice(0, filename.length - reg.toString().length);
        arr = filename.split('\\');
    } else {
        arr = filename.split('\\');
    }
    return arr[arr.length - 1];
}

function AddListView(extension) {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    var files = session.ListFiles("*" + extension, pfcCreate("pfcFileListOpt").FILE_LIST_LATEST, GetWorkDir());
    for (var i = 0; i < files.Count; i++) {
        var sheets = Sheetsinfo(files.Item(i));
        for (var j = 0; j < sheets.length; j++) {
            var z;
            z = document.getElementById(extension).rows.length - 1;
            var tableRow = document.getElementById(extension).insertRow(z + 1);
            tableRow.setAttribute("align", "center");
            tableRow.setAttribute("sheetnumber", j + 1);
            var Cell_0 = tableRow.insertCell(0);
            var Cell_1 = tableRow.insertCell(1);
            if (j === 0) {
                Cell_0.innerHTML = i + 1;
            }
            Cell_1.innerHTML = getrealFilename(files.Item(i), extension);
            var Cell_2 = tableRow.insertCell(2);
            Cell_2.innerHTML = "第" + (j + 1) + "个" + "sheet";
            var Cell_3 = tableRow.insertCell(3);
            Cell_3.innerHTML = "<select style='width:200px'><option value= '" + j + "'>" + sheets[j] + "</option></seletct>";
        }
    }
}

function Sheetsinfo(file) {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var ret = [];

    var session = pfcGetProESession();
    var mdlDescr = pfcCreate("pfcModelDescriptor").CreateFromFileName(getrealFilename(file, ".drw"));
    var mdl = session.GetModelFromDescr(mdlDescr);
    if (mdl == null) {
        mdl = session.RetrieveModel(mdlDescr);
    }
    var sheets = mdl.NumberOfSheets;
    for (var i = 1; i <= sheets; i++) {
        var format = mdl.GetSheetFormat(i);
        var formatName;
        if (format === null)
            formatName = "未设置图框";
        else
            formatName = format.FileName;
        ret[i - 1] = formatName;
    }
    return ret;
}


function getfrms(Directory) {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var frms = [];
    var session = pfcGetProESession();
    var files = session.ListFiles("*.frm", pfcCreate("pfcFileListOpt").FILE_LIST_LATEST, Directory);
    for (var i = 0; i < files.Count; i++) {
        frms[i] = files.Item(i);
    }
    return frms;
}

function MassReplace() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var trs = document.getElementById(".drw").getElementsByTagName("tr");
    var session = pfcGetProESession();

    for (var i = 0; i < trs.length; i++) {
        var tds = trs[i].getElementsByTagName("td");
        var frmselect = tds[3].getElementsByTagName("select")[0];
        var index = frmselect.selectedIndex;
        var textsel = frmselect.options[index].text;
        if (textsel.substr(1, 2) == ":\\") {
            var drwDescr = pfcCreate("pfcModelDescriptor").CreateFromFileName(tds[1].innerHTML);
            var drw = session.GetModelFromDescr(drwDescr);
            if (drw == null) {
                drw = session.RetrieveModel(drwDescr);
            }

            var frmDescr = pfcCreate("pfcModelDescriptor").CreateFromFileName(getrealFilename(textsel, ".frm"));
            var frm = session.GetModelFromDescr(frmDescr);
            if (frm == null) {
                frm = session.RetrieveModel(frmDescr);
            }

            drw.SetSheetFormat(trs[i].getAttribute("sheetnumber"), frm, 0, null);
            drw.Save();
        }
    }
    session.EraseUndisplayedModels();
    session.UIShowMessageDialog("图框已全部替换。", null);
}