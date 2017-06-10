var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function requireWebCam() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
            return false;
        try {
            this.webCamStream = yield navigator.mediaDevices.getUserMedia({ video: true });
            return true;
        }
        catch (e) {
            return false;
        }
    });
}
(() => __awaiter(this, void 0, void 0, function* () {
    if (yield requireWebCam()) {
        window.close();
    }
    else {
        alert("權限取得失敗");
    }
}))();
//# sourceMappingURL=requireWebCam.js.map