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

    var observer = new MutationObserver(function (mutations, observer) {
        // fired when a mutation occurs

        queryResult = $(faceQuery).not('span > a');
        faceCommentDiv = queryResult.closest('div.UFIComment, div.userContentWrapper');
        faceCommentDiv.find('a').contents().unwrap().wrap('<b></b>');

        faceCommentDiv.wrap('<div class="blur"></div>');

    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(document, {
        subtree: true,
        attributes: true
        //...
    });
})();