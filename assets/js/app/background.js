chrome.browserAction.onClicked.addListener(function (activeTab) {
    chrome.tabs.create({
        'url': chrome.extension.getURL('index.html')
    }, function (tab) {
        // Tab opened.
    });
});
