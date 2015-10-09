(function() {
    GLOBALS.pagesProm = getPages();

    function getPages() {
        return Promise.resolve($.get(GLOBALS.serverUrl+'/api/user/page')).then(null, function() {
            return [];
        });
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.title === "login") {
            GLOBALS.pagesProm = getPages();
        }
    });
})();