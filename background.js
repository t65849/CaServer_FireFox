var testt = false;

function genericOnClick(info, tab) {
    var number_destinationid = (info.selectionText ? info.selectionText : ""); //滑鼠選起來的號碼
    number_destinationid = number_destinationid.trim();
    number_destinationid = number_destinationid.replace('(', '').replace(')', '').replace('(', '').replace(')', '').replace('-', '').replace('-', '').replace('#', ',');
    callout(number_destinationid);
}

function createMenus() {
    var parent = browser.contextMenus.create({
        "title": "使用分機撥打電話給%s", //撥打分機給browser Extension
        "contexts": ['all'],
        "onclick": genericOnClick
    });
    // 使用browser.contextMenus.create的方法回傳值是項目的id
    console.log(parent);
}

function callout(destination) {
    browser.storage.local.get({
        stationid: '',
        destinationid: '',
        name: '',
        caserverurl: ''
    }, function (items) {
        console.log(items.stationid);
        console.log(items.destinationid);
        console.log(items.name);
        var stationid = items.stationid;
        var destinationid = destination;
        var name = items.name;
        var caserverurl = items.caserverurl;
        if (stationid !== '' && name !== '' && caserverurl !== '') {
            $.ajax({
                url: caserverurl + '/makecall', //https://tstiticctcstest.herokuapp.com/phone
                headers: {
                    'accept': 'application/json',
                    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQzMjAzNDg4LCJleHAiOjE1NDU3OTU0ODh9.IBfRibqo1heFBT93Vz-mFIMlEBvycwpML4rBnC3k8rg',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'
                },
                type: 'POST',
                data: JSON.stringify({
                    stationid: stationid,
                    destinationid: destinationid,
                    name: name
                }),
                dataType: 'json',
                success: function (reg) {
                    console.log(JSON.stringify(reg));
                    $('#endcall').toggle();
                    browser.storage.local.set({ //若成功撥出，儲存選取的號碼
                        destinationid: destinationid,
                    }, function () {
                        // Update status to let user know options were saved.
                    });
                },
                error: function (reg) {
                    $('#showtext').text("連線失敗!");
                    //return callout(destination);
                }
            });
        } else {
            //alert('你未設定撥號話機，請設定撥號話機');
            browser.tabs.query({
                currentWindow: true,
                active: true
              }).then(sendMessageToTabs).catch(onError);
        }
    });
};
function sendMessageToTabs(tabs) {
    for (let tab of tabs) {
      browser.tabs.sendMessage(
        tab.id,
        {greeting: "你未設定撥號話機，請設定撥號話機"}
      ).then(response => {
        browser.tabs.create({
            url: browser.extension.getURL('options.html')
        });
        console.log("Message from the content script:");
        console.log(response.response);
      }).catch(onError);
    }
  }
browser.runtime.onInstalled.addListener(function () {
    browser.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(sender.tab ?
                "来自内容脚本：" + sender.tab.url :
                "来自扩展程序");
            console.log(request.text);

            var text = request.text.trim().replace('-', '');
            text = text.replace('-', '');
            text = text.replace('(', '');
            text = text.replace(')', '');
            text = text.replace('#', ',');
            if (isMobile(text) || isTel(text) || hasExtension(text) || localnumber(text)) {
                //createMenus();
                if (testt == false) {
                    createMenus();
                    testt = true;
                }
            } else
                browser.contextMenus.removeAll(function () {
                    testt = false
                });
            sendResponse({
                farewell: "已收到選取文字"
            });
        });
});

function isMobile(text) {
    var pattern = new RegExp(/^09\d{8}$/);
    //alert('isMobile: '+text.match(pattern))
    return text.match(pattern)
}

function isTel(text) {
    var pattern = new RegExp(/^0(2|3|37|4|49|5|6|7|8|82|89|826|836)\d{7,8}$/);
    //alert('isTel: '+text.match(pattern))
    return text.match(pattern)
}

function hasExtension(text) {
    var pattern = new RegExp(/^0(2|3|37|4|49|5|6|7|8|82|89|826|836)\d{7,8},\d{3,4}$/);
    //alert('hasExtension: '+text.match(pattern))
    return text.match(pattern)
}

function localnumber(text) {
    var pattern = new RegExp(/\d{4}$/);
    //alert('hasExtension: '+text.match(pattern))
    return text.match(pattern)
}

function handleResponse(message) {
    console.log(`Message from the background script:  ${message.farewell}`);
}

function handleError(error) {
    console.log(`Error: ${error}`);
}
