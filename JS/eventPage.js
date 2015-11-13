// JavaScript source code

chrome.tabs.onActivated.addListener(function(activeInfo) {
    //window.alert("activated");
    count = 0;
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        //window.alert(tab.title);
    }
});

var count = 0;
chrome.webNavigation.onDOMContentLoaded.addListener(function (e) {
    //window.alert("commited");
    count++;
    chrome.browserAction.setBadgeText({ text: count + '', tabId: e.tabId });
    chrome.browserAction.setIcon({ path: "images/icon-On.png" });

}, {
    url: [{ hostSuffix: 'facebook.com' },
                { hostSuffix: 'fb.com' }]
});

