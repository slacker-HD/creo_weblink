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
    var arr;
    if (reg != ".prt") {
        filename = filename.slice(0, filename.length - reg.toString().length);
        arr = filename.split('\\');
    } else {
        arr = filename.split('\\');
    }
    return arr[arr.length - 1];
}

function ExportSteps() {
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
        var inConfiguration = pfcCreate("pfcAssemblyConfiguration");
        var inGeometry = pfcCreate("pfcGeometryFlags").Create();
        inGeometry.AsSolids = true;
        var STEP3DExportInstructions = pfcCreate("pfcSTEP3DExportInstructions").Create(inConfiguration.EXPORT_ASM_SINGLE_FILE, inGeometry);
        mdl.Export(getrealFilename(files.Item(i)) + ".stp", STEP3DExportInstructions);
    }
    session.EraseUndisplayedModels();
    session.UIShowMessageDialog("文件已全部导出。", null);
}

function ExportIgeses() {
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
        var GeomExportFlags = pfcCreate("pfcGeomExportFlags").Create();
        GeomExportFlags.Bezier = true;
        GeomExportFlags.ExtendSRF = false;
        var IGES3DExportInstructions = pfcCreate("pfcIGES3DExportInstructions").Create(GeomExportFlags);
        mdl.Export(getrealFilename(files.Item(i)) + ".igs", IGES3DExportInstructions);
    }
    session.EraseUndisplayedModels();
    session.UIShowMessageDialog("文件已全部导出。", null);
}

function ExportPdfs() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    var files = session.ListFiles("*.drw", pfcCreate("pfcFileListOpt").FILE_LIST_LATEST, GetWorkDir());
    for (var i = 0; i < files.Count; i++) {
        var mdlDescr = pfcCreate("pfcModelDescriptor").CreateFromFileName(getrealFilename(files.Item(i)));
        var mdl = session.GetModelFromDescr(mdlDescr);
        if (mdl == void null) {
            mdl = session.RetrieveModel(mdlDescr);
        }
        var PDFExportInstructions = pfcCreate("pfcPDFExportInstructions").Create();
        PDFExportInstructions.Options = null;
        PDFExportInstructions.ProfilePath = null;
        PDFExportInstructions.FilePath = getrealFilename(files.Item(i)) + ".pdf";
        mdl.Display();
        mdl.Export(getrealFilename(files.Item(i)) + ".pdf", PDFExportInstructions);
        mdl.Erase();
    }
    session.EraseUndisplayedModels();
    session.UIShowMessageDialog("文件已全部导出。", null);
}


function ExportDwgs() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    var files = session.ListFiles("*.drw", pfcCreate("pfcFileListOpt").FILE_LIST_LATEST, GetWorkDir());
    for (var i = 0; i < files.Count; i++) {
        var mdlDescr = pfcCreate("pfcModelDescriptor").CreateFromFileName(getrealFilename(files.Item(i)));
        var mdl = session.GetModelFromDescr(mdlDescr);
        if (mdl == void null) {
            mdl = session.RetrieveModel(mdlDescr);
        }
        var DWG3DExportInstructions = pfcCreate("pfcDWG3DExportInstructions").Create();
        mdl.Export(getrealFilename(files.Item(i)) + ".dwg", DWG3DExportInstructions);
    }
    session.EraseUndisplayedModels();
    session.UIShowMessageDialog("文件已全部导出。", null);
}