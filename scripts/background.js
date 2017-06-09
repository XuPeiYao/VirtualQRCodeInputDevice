chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, {
        "file": "scripts/main.js"
    });
});
//# sourceMappingURL=background.js.map