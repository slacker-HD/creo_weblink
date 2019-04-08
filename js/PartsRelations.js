function init() {
    document.getElementById("directory").innerHTML = GetWorkDir();
}

function GetWorkDir() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    return session.GetCurrentDirectory();
}

function getrealFilename(filename) {
    var reg = /\.[^\.]+$/.exec(filename);
    if (reg != ".prt") {
        filename = filename.slice(0, filename.length - reg.toString().length);
        var arr = filename.split('\\');
        return arr[arr.length - 1];
    } else {
        var arr = filename.split('\\');
        return arr[arr.length - 1];
    }
}

function RemoveRels() {
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
        mdl.DeleteRelations();
        mdl.Save();
    }
    session.EraseUndisplayedModels();
    // var dialogoptions = pfcCreate("pfcMessageDialogOptions").Create();
    // dialogoptions.DialogLabel = "提示";
    session.UIShowMessageDialog("操作全部完成。", null);
}

function AddRels() {
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
        var relations = pfcCreate("stringseq");
        relations = mdl.Relations;
        var strs = document.getElementById("rels").value.split("\n");
        for (var j = 0; j < strs.length; j++) {
            relations.Append(strs[j]);
        }
        mdl.Relations = relations;
        mdl.Save();
    }
    session.EraseUndisplayedModels();
    // var dialogoptions = pfcCreate("pfcMessageDialogOptions").Create();
    // dialogoptions.DialogLabel = "提示";
    session.UIShowMessageDialog("操作全部完成。", null);
}