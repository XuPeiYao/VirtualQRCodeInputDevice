var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var locked;
(() => __awaiter(this, void 0, void 0, function* () {
    var viewer = yield Program.getViewer();
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
    var onQRCode = (code) => {
        console.log(code);
        if (locked)
            return;
        locked = true;
        setTimeout(() => {
            locked = null;
        }, 1000);
        console.info("qrCode: " + code);
        var input;
        if (document.activeElement && document.activeElement.tagName == "INPUT") {
            input = document.activeElement;
            input.value = (input.value || "") + code;
        }
        else if (document.activeElement && document.activeElement.tagName == "IFRAME") {
            function findInput(a) {
                if (a.activeElement.tagName == "IFRAME") {
                    findInput(a.contentDocument);
                }
                else if (a.activeElement.tagName == "INPUT") {
                    input = a.activeElement;
                    input.value = (input.value || "") + code;
                }
            }
            findInput(document.activeElement.contentDocument);
        }
        else {
            return;
        }
        beep.play();
        function fireKey(el, key) {
            function getXPathForElement(element) {
                const idx = (sib, name) => sib
                    ? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName == name)
                    : 1;
                const segs = elm => !elm || elm.nodeType !== 1
                    ? ['']
                    : elm.id && document.querySelector(`#${elm.id}`) === elm
                        ? [`id("${elm.id}")`]
                        : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
                return segs(element).join('/');
            }
            var s = document.createElement('script');
            s.type = 'text/javascript';
            var code = `
                function getElementByXpath(path) {
                    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                }
                var eventObj = document.createEvent("Events");
                eventObj.initEvent("keydown", true, true);
                eventObj['which'] = ${key}; 
                eventObj['keyCode'] = ${key};
                getElementByXpath('${getXPathForElement(el)}').dispatchEvent(eventObj);
            `;
            s.appendChild(document.createTextNode(code));
            document.body.appendChild(s);
        }
        fireKey(input, 13);
        function submitForm(ele) {
            if (ele.tagName == "FORM") {
                window['p'] = ele;
                console.log(ele);
                var f = ele;
                if ((f.action && f.action.length) || f.onsubmit) {
                    ele.submit();
                }
                return;
            }
            if (ele.parentNode) {
                submitForm(ele.parentNode);
            }
        }
        submitForm(input);
    };
    var canvas = document.getElementById("qr-canvas");
    var context = canvas.getContext('2d');
    var port = chrome.runtime.connect({ name: "webCamImage" });
    port.onMessage.addListener((msg) => {
        if (msg.dataUrl) {
            var img = new Image();
            img.onload = function () {
                context.drawImage(img, 0, 0);
            };
            img.src = msg.dataUrl;
        }
        else {
            onQRCode(msg.code);
        }
    });
}))();
//# sourceMappingURL=addViewer.js.map