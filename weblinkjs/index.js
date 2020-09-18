function init() {
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    // var session = pfcGetProESession();
    // session.NavigatorPaneBrowserAdd("辅助设计", null, session.CurrentWindow.GetURL());
}