$(document).mouseup(function () {
    getselecttext();
});

function getselecttext() {
    var t = '';
    if (window.getSelection && window.getSelection()!='') {
        t = window.getSelection();
    } else if (document.getSelection && document.getSelection()!='') {
        t = document.getSelection();

    } else if (document.activeElement.value.substring(
        document.activeElement.selectionStart,
        document.activeElement.selectionEnd) != '') {
        t = document.activeElement.value.substring(
            document.activeElement.selectionStart,
            document.activeElement.selectionEnd);
    
    }
    console.log(t)
    /*
        var e = event || window.event;
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = e.pageX || e.clientX + scrollX;
        var y = e.pageY || e.clientY + scrollY;
    */
    var sending = browser.runtime.sendMessage({
        text: String(t)
    });
    sending.then(handleResponse, handleError);


}

function handleResponse(message) {
    console.log(`Message from the background script:  ${message.farewell}`);
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function getSelectionText() {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange().text;
    }
    return '';
}
/*
function test() {
    if (document.selection && document.selection.createRange) {
        var myRange = document.selection.createRange();
        var m = myRange.pasteHTML('<iframe width=100 height=100 src="http://localhost/t2.htm"></iframe>');
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        var newP = document.createElement('iframe');
        newP.src = "http://localhost/t2.htm";
        newP.width = "100";
        newP.height = "100";
        range.insertNode(newP);
    }
}*/