// JavaScript source code

chrome.tabs.onActivated.addListener(function(activeInfo) {
    //window.alert("activated");
    document.title = "lel";
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        //window.alert(tab.title);
    }
});

chrome.webNavigation.onDOMContentLoaded.addListener(function (e) {
    //window.alert("commited");

    document.addEventListener('DOMNodeInserted', function () { alert("dom change"); });

}, {
    url: [{ hostSuffix: 'facebook.com' },
                { hostSuffix: 'fb.com' }]
});

