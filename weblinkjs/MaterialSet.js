function init() {
    document.getElementById("directory").innerHTML = GetWorkDir();
    AddListView(".prt");
}

function GetWorkDir() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    return session.GetCurrentDirectory();
}

function ChooseMatDirectory() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    try {
        var path = session.UISelectDirectory(pfcCreate('pfcDirectorySelectionOptions').Create());
        document.getElementById("directoryMat").innerHTML = path;
        var mats = getmats(path);
        var trs = document.getElementById(".prt").getElementsByTagName("tr");
        for (var i = 0; i < trs.length; i++) {
            var tds = trs[i].getElementsByTagName("td");
            var matselect = tds[3].getElementsByTagName("select")[0];
            matselect.options.length = 1;
            for (var l = 0; l < mats.length; l++) {
                matselect.options.add(new Option(mats[l], l + 1));
            }
        }
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

function getFileNameByPath(path) {
    path = path.split("\\");
    return path[path.length - 1];
}

function matinfo(file) {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    var mdlDescr = pfcCreate("pfcModelDescriptor").CreateFromFileName(getrealFilename(file, ".prt"));
    var mdl = session.GetModelFromDescr(mdlDescr);
    if (mdl == null) {
        mdl = session.RetrieveModel(mdlDescr);
    }
    var Material = mdl.CurrentMaterial;
    if (Material == null)
        return "未设置材料";
    else
        return Material.Name;
}

function getmats(Directory) {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var mats = [];
    var session = pfcGetProESession();
    var files = session.ListFiles("*.mtl", pfcCreate("pfcFileListOpt").FILE_LIST_LATEST, Directory);
    for (var i = 0; i < files.Count; i++) {
        mats[i] = files.Item(i);
    }
    return mats;
}

function AddListView(extension) {
    if (!pfcIsWindows())
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
        Cell_1.innerHTML = getrealFilename(files.Item(i), extension);
        var Cell_2 = tableRow.insertCell(2);
        Cell_2.innerHTML = matinfo(files.Item(i));
        var Cell_3 = tableRow.insertCell(3);
        Cell_3.innerHTML = "<select style='width:200px'><option>不更改</option></seletct>";
    }
}

function MassChangeMat() {

    var trs = document.getElementById(".prt").getElementsByTagName("tr");
    var session = pfcGetProESession();
    for (var i = 0; i < trs.length; i++) {
        try {
            var tds = trs[i].getElementsByTagName("td");
            var frmselect = tds[3].getElementsByTagName("select")[0];
            var index = frmselect.selectedIndex;
            if (index !== 0) {
                var textsel = frmselect.options[index].text;
                session.ChangeDirectory(document.getElementById("directory").innerHTML);
                var prtDescr = pfcCreate("pfcModelDescriptor").CreateFromFileName(tds[1].innerHTML);
                var prt = session.GetModelFromDescr(prtDescr);
                if (prt == null) {
                    prt = session.RetrieveModel(prtDescr);
                }
                session.ChangeDirectory(document.getElementById("directoryMat").innerHTML);
                var material = prt.RetrieveMaterial(getFileNameByPath(textsel));
                prt.CurrentMaterial = material;
                tds[2].innerHTML = material.name;
                session.ChangeDirectory(document.getElementById("directory").innerHTML);
                prt.Save();
            }
        } catch (error) {

        }
    }
    session.EraseUndisplayedModels();
    session.UIShowMessageDialog("材料已全部替换。", null);
}