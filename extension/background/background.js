var pagesProm=getPages();

function getPages(){
  return Promise.resolve($.get('http://127.0.0.1:1337/api/user/page'));
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.title){
        case 'newPage':
            pagesProm.then(function(pages){
                var pageToContent=pages.filter(function(page){
                    return (page.url===sender.url);
                });
                sendResponse(pageToContent);
            });
            return true;
        case 'destroyNote':
            console.log('destroyNote');
            $.ajax({
                url:'http://127.0.0.1:1337/api/note/'+request.noteId,
                type:'DELETE',
                success: function(){
                    console.log('delete Confrimed');
                    pagesProm.then(function(pages){
                        pages.some(function(page){
                            if(page.url!==sender.url) return false;
                            return page.notes.some(function(note,index){
                                if(note._id===request.noteId){
                                    page.notes.splice(index,1);
                                    return true;
                                }
                                return false;
                            });
                        });
                        sendResponse('deleted');
                    });
                }
            });
            return true;
    }
});
