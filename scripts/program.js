var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Program {
    /**
     * 程式進入點
     * @param args 參數
     */
    static main(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRunning) {
                document.getElementById("webCamViewer").remove();
                this.webCamStream.getTracks()[0].stop();
                this.isRunning = false;
                clearInterval(this.intervalId);
                return;
            }
            this.isRunning = true;
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
                    return;
                this.webCamStream = yield navigator.mediaDevices.getUserMedia({ video: true });
                var viewer = yield Program.getWebCamViewer();
                document.body.appendChild(viewer);
                viewer.onmousedown = () => { this.moveable = true; };
                viewer.onmouseup = () => { this.moveable = false; };
                viewer.onmouseleave = viewer.onmouseup;
                viewer.onmousemove = (e) => {
                    if (!this.moveable)
                        return;
                    viewer.style.right = parseInt(window.getComputedStyle(viewer).right) - e.movementX + "px";
                    viewer.style.bottom = parseInt(window.getComputedStyle(viewer).bottom) - e.movementY + "px";
                };
                var video = document.getElementById("webCamViewer_video");
                video.src = window.URL.createObjectURL(this.webCamStream);
                video.play();
                qrcode.callback = (code) => {
                    console.log(code);
                    console.log(document.activeElement.tagName);
                    if (!document.activeElement || document.activeElement.tagName != "INPUT")
                        return;
                    document.activeElement.value = (document.activeElement.value || "") + code + '\n';
                };
                this.intervalId = setInterval(this.decodeQR, 100);
            }
            catch (e) {
                this.isRunning = false;
            }
        });
    }
    static decodeQR() {
        var canvas_video = document.getElementById("qr-canvas");
        var canvas_video_context = canvas_video.getContext("2d");
        canvas_video_context.drawImage(document.getElementById("webCamViewer_video"), 0, 0, 400, 300);
        try {
            qrcode.decode();
        }
        catch (e) { }
    }
    /**
     * 取得網路攝影機視窗樣板
     */
    static getWebCamViewer() {
        return new Promise((res, rej) => {
            var request = new XMLHttpRequest();
            request.open("GET", chrome.extension.getURL("templates/webCamViewer.html"), true);
            request.onload = function () {
                res(Extension.convertStringToNode(request.responseText));
            };
            request.send();
        });
    }
}
/**
 * 是否執行中
 */
Program.isRunning = false;
Program.moveable = false;
//# sourceMappingURL=program.js.map