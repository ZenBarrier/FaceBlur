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

        faceQuery = 'a[href^="' + blockedFaces.join('"], a[href^="') + '"]';

        console.log(blockedFaces);
        console.log(faceQuery);
    });

    

    function blurFaces() {
        queryResult = $(faceQuery).not('span > a');
        faceCommentDiv = queryResult.closest('div.UFIComment, div.userContentWrapper');
        faceCommentDiv.find('a').contents().unwrap().wrap('<b></b>');

        faceCommentDiv.wrap('<div class="blur"></div>');
    }

    var observer = new MutationObserver(function (mutations, observer) {
        // fired when a mutation occurs
        blurFaces();
    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(document, {
        subtree: true,
        attributes: true
        //...
    });

    chrome.storage.onChanged.addListener(function (changes, areaName) {
        console.log(changes);

        var blockedFacesObjectArray = changes.StoredBlockedFaces.newValue;

        blockedFaces = blockedFacesObjectArray.map(function (item) {
            return item['profile'];
        });

        faceQuery = 'a[href^="' + blockedFaces.join('"], a[href^="') + '"]';
        console.log(faceQuery);

        blurFaces();
    });

})();