/*
   HISTORY

14-NOV-02   J-03-38   $$1   JCN      Submitted.
07-MAR-03   K-01-03   $$2   JCN      UNIX support
01-MAY-07   L-01-31   $$3   JCN      New exception messaging.
19-Feb-14   P-20-48   $$4 gshmelev   used pfcIsMozilla
20-Nov-14   P-20-63   $$5 rkumbhare  Updated for chromium browser function.
 */

function isProEEmbeddedBrowser() {
  if (top.external && top.external.ptc)
    return true;
  else
    return false;
}

function pfcIsMozilla() {
  if (pfcIsWindows())
    return false;
  if (pfcIsChrome())
    return false;

  return true;
}

function pfcIsChrome() {
  var ua = navigator.userAgent.toString().toLowerCase();
  var val = ua.indexOf("chrome/"); // Chrome
  if (val > -1) {
    return true;
  }
  else
    return false;
}

function pfcIsWindows() {
  if (navigator.userAgent.toString().toLowerCase().indexOf("trident") != -1)
    return true;
  else
    return false;
}

function pfcCreate(className) {
  if (pfcIsWindows())
    return new ActiveXObject("pfc." + className);
  else if (pfcIsChrome())
    return pfcCefCreate(className);
  else if (pfcIsMozilla()) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    ret = Components.classes["@ptc.com/pfc/" + className + ";1"].createInstance();
    return ret;
  }
}

function pfcGetProESession() {
  if (!isProEEmbeddedBrowser()) {
    throw new Error("Not in embedded browser.  Aborting...");
  }

  // Security code
  if (pfcIsMozilla())
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

  var glob = pfcCreate("MpfcCOMGlobal");
  return glob.GetProESession();
}

function pfcGetScript() {
  if (!isProEEmbeddedBrowser()) {
    throw new Error("Not in embedded browser.  Aborting...");
  }

  // Security code
  if (pfcIsMozilla())
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

  var glob = pfcCreate("MpfcCOMGlobal");
  return glob.GetScript();
}


function pfcGetExceptionDescription(err) {
  if (pfcIsWindows())
    errString = err.description;
  else if (pfcIsChrome())
    errString = window.pfcCefGetLastException().message;
  else if (pfcIsMozilla())
    errString = err.message;
  return errString;
}

function pfcGetExceptionType(err) {
  errString = pfcGetExceptionDescription(err);

  // This should remove the XPCOM prefix ("XPCR_C")
  if (errString.search("XPCR_C") < 0) {
    errString = errString.replace("Exceptions::", "");
    semicolonIndex = errString.search(";");
    if (semicolonIndex > 0)
      errString = errString.substring(0, semicolonIndex);
    return (errString);
  }
  else
    return (errString.replace("XPCR_C", ""));
}


