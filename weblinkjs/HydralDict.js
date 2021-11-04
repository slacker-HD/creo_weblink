var xmlHttp;

function createXMLHttpRequest() {
    if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
}

function GetWords() {
    if (document.getElementById("keyword").value !== "") {
        createXMLHttpRequest();
        var url = "../php/dict.php";
        xmlHttp.open("POST", url);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.onreadystatechange = callback;
        xmlHttp.send('value=' + document.getElementById("keyword").value + '');
    }
}

function callback() {
    if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
            document.getElementById("word").innerHTML = xmlHttp.responseText;
        }
    }
}