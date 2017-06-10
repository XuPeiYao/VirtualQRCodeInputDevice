var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason.search(/install/g) === -1) {
        return;
    }
    chrome.tabs.create({
        url: chrome.extension.getURL('templates/requireWebCam.html'),
        active: true
    });
});
chrome.browserAction.onClicked.addListener(function (tab) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Program.hasTab(tab)) {
            yield Program.removeTab(tab);
        }
        else {
            yield Program.addTab(tab);
        }
    });
});
chrome.tabs.onUpdated.addListener((id, info, tab) => __awaiter(this, void 0, void 0, function* () {
    if (Program.hasTab(tab) && info.status) {
        yield Program.removeTab(tab);
        yield Program.addTab(tab);
    }
}));
chrome.tabs.onRemoved.addListener((id) => __awaiter(this, void 0, void 0, function* () {
    if (Program.hasTabId(id)) {
        yield Program.removeTabId(id);
        yield Program.addTabId(id);
    }
}));
chrome.tabs.onUpdated.addListener((id, info, tab) => __awaiter(this, void 0, void 0, function* () {
    if (Program.hasTab(tab) && info.status) {
        yield Program.removeTab(tab);
        yield Program.addTab(tab);
    }
}));
//# sourceMappingURL=background.js.map