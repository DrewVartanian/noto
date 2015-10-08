var pagesProm=getPages();

function getPages(){
  return Promise.resolve($.get('http://127.0.0.1:1337/api/user/page'));
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.title){
        case 'newPopup': pagesProm.then(function(pages){
            console.log("newPopup", pages);
            sendResponse(pages);
        });
            return true;
        case 'newPage':
            pagesProm.then(function(pages){
                var pageToContent=pages.filter(function(page){
                    console.log('page url: ',page.url);
                    console.log('sender url: ',sender.url);
                    return (page.url===sender.url);
                });
                console.log('page matches',pageToContent);
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
        // saveNote
        case 'saveNote':
            console.log('saveNote');
            $.ajax({
                url:'http://127.0.0.1:1337/api/note/'+request.noteId,
                type:'PUT',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({message: request.message}),
                success: function(res){
                    console.log('save confirmed');
                    pagesProm.then(function(pages){
                        pages.some(function(page){
                            if(page.url!==sender.url) return false;
                            return page.notes.some(function(note,index){
                                if(note._id===request.noteId){
                                    page.notes[index] = res;
                                    return true;
                                }
                                return false;
                            });
                        });
                        sendResponse(res);
                    });
                }

            });
            return true;

    }
});
