declare var chrome,qrcode;
class Program{
    /**
     * 是否執行中
     */
    private static isRunning : boolean = false;

    private static webCamStream: MediaStream;

    private static moveable :boolean = false;

    private static intervalId :number;

    private code:string;
    /**
     * 程式進入點
     * @param args 參數
     */
    public static async main(...args: string[]): Promise<void>{
        if(this.isRunning){
            document.getElementById("webCamViewer").remove();
            this.webCamStream.getTracks()[0].stop();
            this.isRunning = false;
            clearInterval(this.intervalId);
            return;
        }
        this.isRunning = true;
        try{
            if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
            this.webCamStream = await navigator.mediaDevices.getUserMedia({ video: true });

            var viewer = await Program.getWebCamViewer();   
            document.body.appendChild(viewer);

            viewer.onmousedown = ()=>{this.moveable = true;}
            viewer.onmouseup = ()=>{this.moveable = false;}
            viewer.onmouseleave = viewer.onmouseup;
            viewer.onmousemove = (e)=>{
                if(!this.moveable)return;
                viewer.style.right = parseInt(window.getComputedStyle(viewer).right) - e.movementX + "px";
                viewer.style.bottom = parseInt(window.getComputedStyle(viewer).bottom) - e.movementY + "px";
            }
            
            var video = document.getElementById("webCamViewer_video");
            video.src =window.URL.createObjectURL(this.webCamStream)
            video.play();

            qrcode.callback = (code)=>{
                console.log(code);
                if(!document.activeElement || document.activeElement.tagName != "INPUT" )return;
                console.log("set Value");

                if(this.code == code)return;
                this.code = code;
                
                document.activeElement.value =(document.activeElement.value || "") + code;

            }
            this.intervalId = setInterval(this.decodeQR,100);
        }catch(e){
            this.isRunning = false;
        }
    }

    public static decodeQR() : void{
        var canvas_video = document.getElementById("qr-canvas");
        var canvas_video_context = canvas_video.getContext("2d");
        canvas_video_context.drawImage(document.getElementById("webCamViewer_video") ,0,0,400,300);
        try{
            qrcode.decode();
        }catch(e){}
    }

    /**
     * 取得網路攝影機視窗樣板
     */
    public static getWebCamViewer(): Promise<HTMLElement>{
        return new Promise<HTMLElement>((res,rej)=>{
            var request = new XMLHttpRequest();
            request.open("GET", chrome.extension.getURL("templates/webCamViewer.html"), true);
            request.onload = function(){
                res(<HTMLElement>Extension.convertStringToNode(request.responseText));
            }
            request.send();
        });
    }
}