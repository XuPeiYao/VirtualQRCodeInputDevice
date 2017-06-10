class Program{
    public static webCamStream : MediaStream;
    public static tabs : any[] = [];
    public static ports = {};
    public static timer : number;
    public static hasTab(tab):boolean{
        return this.tabs.filter(x=>x.id == tab.id).length > 0;
    }
    public static async addTab(tab):Promise<void>{
        chrome.tabs.executeScript(tab.id, {
            "file":"scripts/addViewer.js"
        });
        Program.tabs.push(tab);
        
        chrome.runtime.onConnect.addListener(async(port) => {
            if(port.name != "webCamImage")return;
            Program.ports[tab.id] = port;
            //port.postMessage({question: "Who's there?"});
        });

        Program.startStream();
    }
    public static async removeTab(tab):Promise<void>{
        chrome.tabs.executeScript(tab.id, {
            "file":"scripts/removeViewer.js"
        });
        Program.tabs = Program.tabs.filter(x=>x.id != tab.id);
        Program.ports[tab.id] = undefined;
        
        await Program.stopStream();
    }

    public static async stopStream():Promise<void>{
        if(Program.tabs.length == 0){
            Program.webCamStream.getTracks()[0].stop();
            Program.webCamStream = null;
            clearInterval(Program.timer);
            Program.timer = null;
        }
    }
    public static async startStream():Promise<void>{
        if(Program.timer)return;

        var video : HTMLVideoElement= document.createElement("video");
        document.body.appendChild(video);
        
        var canvas: HTMLCanvasElement = document.createElement("canvas");
        document.body.appendChild(canvas);

        video.src = URL.createObjectURL(await Program.getWebCamStream());
        video.play();

        canvas.width = 400;
        canvas.height = 300;

        Program.timer = setInterval(()=>{
            canvas.getContext('2d').drawImage(video,0,0,400,300);
            var dataUrl = canvas.toDataURL();
            for(var id in Program.ports){
                 if(!Program.ports[id])continue;
                 Program.ports[id].postMessage({
                     dataUrl : dataUrl
                 });
            }
        },200,true);
        
    }
    public static getViewer(): Promise<HTMLElement>{
        return new Promise<HTMLElement>((res,rej)=>{
            var request = new XMLHttpRequest();
            request.open("GET", chrome.extension.getURL("templates/webCamViewer.html"), true);
            request.onload = function(){
                res(<HTMLElement>Extension.convertStringToNode(request.responseText));
            }
            request.send();
        });
    }
    public static async getWebCamStream():Promise<MediaStream>{
        if(!Program.webCamStream){
            Program.webCamStream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
        return Program.webCamStream;
    }
}