declare var chrome,qrcode,jQuery,$,beep;
var locked;
(async()=>{
    var viewer = await Program.getViewer();   
    document.body.appendChild(viewer);

    viewer.onmousedown = ()=>{this.moveable = true;}
    viewer.onmouseup = ()=>{this.moveable = false;}
    viewer.onmouseleave = viewer.onmouseup;
    viewer.onmousemove = (e)=>{
        if(!this.moveable)return;
        viewer.style.right = parseInt(window.getComputedStyle(viewer).right) - e.movementX + "px";
        viewer.style.bottom = parseInt(window.getComputedStyle(viewer).bottom) - e.movementY + "px";
    }

    qrcode.callback = (code)=>{
        if(locked)return;

        locked = true;
        setTimeout(()=>{
            locked = null;
        },1000)

        console.info("qrCode: " + code);

        var input ;
        if(document.activeElement && document.activeElement.tagName == "INPUT"){
            input = <HTMLInputElement>document.activeElement;
            input.value =(input.value || "") + code;
        }else if(document.activeElement && document.activeElement.tagName == "IFRAME"){
            function findInput(a){
                if(a.activeElement.tagName == "IFRAME"){
                    findInput(a.contentDocument)
                }else if(a.activeElement.tagName == "INPUT"){
                    input = <HTMLInputElement>a.activeElement;
                    input.value =(input.value || "") + code;
                }
            }
            findInput((<HTMLIFrameElement>document.activeElement).contentDocument);
        }else{
            return;
        }
        
        beep.play();

        var e = $.Event( "keypress", { which: 13 } );
        jQuery(input).trigger(e);
        submitForm(input);
        function submitForm(ele : HTMLElement){
            if(ele.tagName=="FORM"){
                (<HTMLFormElement>ele).submit();
                return;
            }
            if(ele.parentNode){
                submitForm(<HTMLElement>ele.parentNode);
            }
        }
    }


    var canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("qr-canvas");
    var context = canvas.getContext('2d');
    var port = chrome.runtime.connect({name: "webCamImage"});
    port.onMessage.addListener((msg)=>{
        var img = new Image();
        img.onload = function(){
            context.drawImage(img,0,0); 
            qrcode.decode();
        };
        img.src = msg.dataUrl;
    })
})();
