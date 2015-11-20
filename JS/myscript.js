(function(){

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var blockedFaces = [];
    var faceQuery = '';

    chrome.storage.sync.get({
        StoredBlockedFaces: []
    }, function (items) {
        var blockedFacesObjectArray = items.StoredBlockedFaces;

        blockedFaces = blockedFacesObjectArray.map(function (item) {
            return item['profile'];
        });

        faceQuery = 'a[href^=' + blockedFaces.join('], a[href^=') + ']';

        console.log(blockedFaces);
    });

    var observer = new MutationObserver(function (mutations, observer) {
        // fired when a mutation occurs
        console.log(mutations, observer);
        $(faceQuery).parent().parent().hide();

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