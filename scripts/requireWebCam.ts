async function requireWebCam():Promise<boolean>{
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
    try{
        this.webCamStream = await navigator.mediaDevices.getUserMedia({ video: true });
        return true;
    }catch(e){
        return false;
    }
}
(async ()=>{
    if(await requireWebCam()){
        window.close();
    }else{
        alert("權限取得失敗");
    }
})();
