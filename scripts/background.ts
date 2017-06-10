chrome.runtime.onInstalled.addListener((details) => {//取得存取網路攝影機權限
    if (details.reason.search(/install/g) === -1) {
        return;
    }
    chrome.tabs.create({
        url: chrome.extension.getURL('templates/requireWebCam.html'), 
        active: true
    })
})

chrome.browserAction.onClicked.addListener(async function(tab) { 
    if(Program.hasTab(tab)){//close
        await Program.removeTab(tab);
    }else{
        await Program.addTab(tab);        
    } 
});

chrome.tabs.onUpdated.addListener(async(id,info,tab)=>{
    if(Program.hasTab(tab) && info.status){
        await Program.removeTab(tab);
        await Program.addTab(tab);
    }
})