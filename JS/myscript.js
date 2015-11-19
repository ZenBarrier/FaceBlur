(function(){

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var blockedFaces = [];
    chrome.storage.sync.get({
        StoredBlockedFaces: []
    }, function (items) {
        blockedFaces = items.StoredBlockedFaces;
        console.log(blockedFaces);
    });

    var observer = new MutationObserver(function (mutations, observer) {
        // fired when a mutation occurs
        console.log(mutations, observer);
        $('div a[href^="https://www.facebook.com/rosalie.mii"]').parent().parent().hide();

        // ...
    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(document, {
        subtree: true,
        attributes: true
        //...
    });
})();