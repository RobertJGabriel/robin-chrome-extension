chrome.browserAction.onClicked.addListener(function (activeTab) {
    chrome.tabs.create({
        'url': chrome.extension.getURL('assets/view/home.html')
    }, function (tab) {
        // Tab opened.
    });
});
