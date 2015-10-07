var pagesProm=getPages();

function getPages(){
  return Promise.resolve($.get('http://127.0.0.1:1337/api/user/page'));
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request==='newPage'){
        pagesProm.then(function(pages){
            var pageToContent=pages.filter(function(page){
                return (page.url===sender.url);
            });
            sendResponse(pageToContent);
        });
        return true;
    }
});
