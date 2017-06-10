var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Program {
    static hasTab(tab) {
        return this.tabs.filter(x => x.id == tab.id).length > 0;
    }
    static hasTabId(id) {
        return this.tabs.filter(x => x.id == id).length > 0;
    }
    static addTab(tab) {
        return __awaiter(this, void 0, void 0, function* () {
            chrome.tabs.executeScript(tab.id, {
                "file": "scripts/addViewer.js"
            });
            Program.tabs.push(tab);
            chrome.runtime.onConnect.addListener((port) => __awaiter(this, void 0, void 0, function* () {
                if (port.name != "webCamImage")
                    return;
                Program.ports[tab.id] = port;
                //port.postMessage({question: "Who's there?"});
            }));
            Program.startStream();
        });
    }
    static addTabId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            chrome.tabs.get(id, (tab) => __awaiter(this, void 0, void 0, function* () {
                yield Program.addTab(tab);
            }));
        });
    }
    static removeTab(tab) {
        return __awaiter(this, void 0, void 0, function* () {
            chrome.tabs.executeScript(tab.id, {
                "file": "scripts/removeViewer.js"
            });
            Program.tabs = Program.tabs.filter(x => x.id != tab.id);
            Program.ports[tab.id] = undefined;
            yield Program.stopStream();
        });
    }
    static removeTabId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            chrome.tabs.executeScript(id, {
                "file": "scripts/removeViewer.js"
            });
            Program.tabs = Program.tabs.filter(x => x.id != id);
            Program.ports[id] = undefined;
            yield Program.stopStream();
        });
    }
    static stopStream() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Program.tabs.length == 0) {
                Program.webCamStream.getTracks()[0].stop();
                Program.webCamStream = null;
                clearInterval(Program.timer);
                document.getElementsByTagName("video")[0].remove();
                document.getElementsByTagName("canvas")[0].remove();
                Program.timer = null;
            }
        });
    }
    static startStream() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Program.timer)
                return;
            var video = document.createElement("video");
            document.body.appendChild(video);
            var canvas = document.createElement("canvas");
            canvas.id = "qr-canvas";
            document.body.appendChild(canvas);
            video.src = URL.createObjectURL(yield Program.getWebCamStream());
            video.play();
            canvas.width = 400;
            canvas.height = 300;
            qrcode.callback = (code) => {
                console.log(code);
                for (var id in Program.ports) {
                    if (!Program.ports[id])
                        continue;
                    Program.ports[id].postMessage({
                        code: code
                    });
                }
            };
            Program.timer = setInterval(() => {
                canvas.getContext('2d').drawImage(video, 0, 0, 400, 300);
                var dataUrl = canvas.toDataURL();
                for (var id in Program.ports) {
                    if (!Program.ports[id])
                        continue;
                    Program.ports[id].postMessage({
                        dataUrl: dataUrl
                    });
                    qrcode.decode();
                }
            }, 200, true);
        });
    }
    static getViewer() {
        return new Promise((res, rej) => {
            var request = new XMLHttpRequest();
            request.open("GET", chrome.extension.getURL("templates/webCamViewer.html"), true);
            request.onload = function () {
                res(Extension.convertStringToNode(request.responseText));
            };
            request.send();
        });
    }
    static getWebCamStream() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Program.webCamStream) {
                Program.webCamStream = yield navigator.mediaDevices.getUserMedia({ video: true });
            }
            return Program.webCamStream;
        });
    }
}
Program.tabs = [];
Program.ports = {};
//# sourceMappingURL=program.js.map