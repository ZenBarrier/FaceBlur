// JavaScript source code
(function () {

    chrome.tabs.onActivated.addListener(function (activeInfo) {
        //window.alert("activated");
    });

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            //window.alert(tab.title);
        }

    });

    var count = {};
    chrome.webNavigation.onDOMContentLoaded.addListener(function (e) {
        //window.alert("commited");
        chrome.browserAction.setIcon({ path: "images/icon-on.png", tabId: e.tabId });

    }, {
        url: [{ hostSuffix: 'facebook.com' }]
    });

    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
          var tabId = sender.tab.id;

          if (!(tabId in count)) {
              count[tabId] = 0;
          }
          count[tabId] = count[tabId] + request.count;
          console.log(request.count + " " + count[tabId]);
          if (count[tabId] > 0) {
              chrome.browserAction.setBadgeText({ text: count[tabId] + '', tabId: tabId });
          } else {
              chrome.browserAction.setBadgeText({ text: '', tabId: tabId });
          }
      });

})();