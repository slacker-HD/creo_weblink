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

function Unitinfo(file) {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    var mdlDescr = pfcCreate("pfcModelDescriptor").CreateFromFileName(getrealFilename(file, ".prt"));
    var mdl = session.GetModelFromDescr(mdlDescr);
    if (mdl == null) {
        mdl = session.RetrieveModel(mdlDescr);
    }
    var Unit = mdl.GetPrincipalUnits();
    return Unit.Name;
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
        tableRow.setAttribute("filepath", files.Item(i));
        tableRow.setAttribute("align", "center");
        var Cell_0 = tableRow.insertCell(0);
        var Cell_1 = tableRow.insertCell(1);
        Cell_1.innerHTML = i + 1;
        var Cell_2 = tableRow.insertCell(2);
        Cell_2.innerHTML = getrealFilename(files.Item(i), extension);
        var Cell_3 = tableRow.insertCell(3);
        Cell_3.innerHTML = Unitinfo(files.Item(i));
        var Cell_4 = tableRow.insertCell(4);
        if (Cell_3.innerHTML.indexOf("mmNs") != -1) {
            Cell_0.innerHTML = '<input type="checkbox" disabled="true"/>';
            Cell_4.innerHTML = "/";
        } else {
            Cell_0.innerHTML = '<input type="checkbox" checked="checked" />';
            Cell_4.innerHTML = "<select style='width:200px'><option value='0'>转换尺寸</option><option value='1'>解释尺寸</option></option></seletct>";
        }
    }
}

function SetommNsUnit(file, ConvertMethod) {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var session = pfcGetProESession();
    var mdlDescr = pfcCreate("pfcModelDescriptor").CreateFromFileName(getrealFilename(file, ".prt"));
    var mdl = session.GetModelFromDescr(mdlDescr);
    if (mdl == null) {
        mdl = session.RetrieveModel(mdlDescr);
    }
    var UnitSystems = mdl.ListUnitSystems();
    for (var i = 0; i < UnitSystems.Count; i++) {
        if (UnitSystems.Item(i).Name.indexOf("mmNs") != -1) {
            var DimensionOption;
            if (ConvertMethod === 1) {
                DimensionOption = pfcCreate("pfcUnitDimensionConversion").UNITCONVERT_SAME_DIMS;
            } else {
                DimensionOption = pfcCreate("pfcUnitDimensionConversion").UNITCONVERT_SAME_SIZE;
            }
            var options = pfcCreate("pfcUnitConversionOptions").Create(DimensionOption);

            mdl.SetPrincipalUnits(UnitSystems.Item(i), options);
            mdl.Save();
            return true;
        }
    }
    return false;
}

function UnitConfig() {
    if (!pfcIsWindows())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var trs = document.getElementById(".prt").getElementsByTagName("tr");
    var session = pfcGetProESession();

    for (var i = 0; i < trs.length; i++) {
        var tds = trs[i].getElementsByTagName("td");
        if (tds[0].childNodes[0].checked == true) {
            var ConvertMethod = tds[4].childNodes[0].value;
            SetommNsUnit(trs[i].getAttribute("filepath"), ConvertMethod);
        }
    }
    session.EraseUndisplayedModels();
    session.UIShowMessageDialog("操作完毕。", null);
}