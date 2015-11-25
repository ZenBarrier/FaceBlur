(function(){

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var blockedFaces = [];
    var faceQuery = '';
    var unblockedFaces = [];
    var unbluredQuery = '';

    chrome.storage.sync.get({
        StoredBlockedFaces: []
    }, function (items) {
        var blockedFacesObjectArray = items.StoredBlockedFaces;

        blockedFaces = blockedFacesObjectArray.filter(function (face, index, array) {
            return (face.blur);
        }).map(function (item) {
            return item['profile'];
        });

        faceQuery = 'a[href^="' + blockedFaces.join('"], a[href^="') + '"]';

        console.log(blockedFaces);
        console.log(faceQuery);
    });

    

    function blurFaces() {
        var queryResult = $(faceQuery).not('span > a');
        var faceCommentDiv = queryResult.closest('div.UFIComment, div.userContentWrapper');
        //faceCommentDiv.find('a').contents().unwrap().wrap('<b></b>');
        faceCommentDiv.find('a').each(function () {
            var oldLink = $(this).attr('href');
            $(this).contents().unwrap().wrap('<b oldhref="'+oldLink+'"></b>');
        });

        if (faceCommentDiv.length > 0) {
            chrome.runtime.sendMessage({ count: faceCommentDiv.length }, function (response) {
                console.log(response.gotCount);
            });
        }

        faceCommentDiv.wrap('<div class="blur"></div>');
    }

    function unblurFaces() {
        var queryResult = $(unbluredQuery);
        var blurDiv = queryResult.closest('div.blur');
        blurDiv.find('b').each(function () {
            var oldLink = $(this).attr('oldhref');
            $(this).contents().unwrap().wrap('<a href="' + oldLink + '"></a>');
        });
        blurDiv.contents().unwrap();

        if (blurDiv.length > 0) {
            chrome.runtime.sendMessage({ count: (blurDiv.length)*-1 }, function (response) {
                console.log(response.gotCount);
            });
        }
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

        var oldBlockedFaces = blockedFaces;

        blockedFaces = blockedFacesObjectArray.filter(function (face, index, array) {
            return (face.blur);
        }).map(function (item) {
            return item['profile'];
        });
        unblockedFaces = oldBlockedFaces.concat(unblockedFaces).filter(function (profile, index, array) {
            return blockedFaces.indexOf(profile)==-1;
        });
        console.log(unblockedFaces)
        unbluredQuery = 'b[oldhref^="' + unblockedFaces.join('"], b[oldhref^="') + '"]';

        faceQuery = 'a[href^="' + blockedFaces.join('"], a[href^="') + '"]';
        console.log(faceQuery);

        blurFaces();
        unblurFaces();
    });

})();