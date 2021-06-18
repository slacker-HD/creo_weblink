function init() {
    document.getElementById("directory").innerHTML = GetWorkDir();
    AddListView(".drw");
}

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
        Cell_0.innerHTML = '<input type="checkbox" checked="true" />';
        var Cell_1 = tableRow.insertCell(1);
        Cell_1.innerHTML = document.getElementById(extension).rows.length;
        var Cell_2 = tableRow.insertCell(2);
        Cell_2.innerHTML = getrealFilename(files.Item(i), extension);
    }
}
