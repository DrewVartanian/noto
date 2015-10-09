(function(){
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch(request.title){
            case 'logout' :
                console.log("i got the message");
                GLOBALS.pagesProm.then(function(pages){
                    console.log("logout", pages);
                    GLOBALS.pagesProm = Promise.resolve([]);
                });
                GLOBALS.teamsProm.then(function(teams){
                    console.log("logout", teams);
                    GLOBALS.teamsProm = Promise.resolve([]);
                });
                break;
            case 'newPage':
                Promise.all([GLOBALS.pagesProm,GLOBALS.teamsProm]).then(function(dbInfo){
                    var pageToContent=dbInfo[0].filter(function(page){
                        return (page.url===sender.url);
                    });
                    sendResponse({pages: pageToContent,teams: dbInfo[1]});
                });
                return true;
            case 'destroyNote':
                $.ajax({
                    url:'http://127.0.0.1:1337/api/note/'+request.noteId,
                    type:'DELETE',
                    success: function(){
                        GLOBALS.pagesProm.then(function(pages){
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
                $.ajax({
                    url:'http://127.0.0.1:1337/api/note/'+request.noteId,
                    type:'PUT',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        message: request.message,
                        newTeam: request.newTeam,
                        oldTeam: request.oldTeam,
                        url: sender.url
                    }),
                    success: function(res){
                        GLOBALS.pagesProm.then(function(pages){
                            if(request.newTeam===request.oldTeam){
                                pages.some(function(page){
                                    if(page.url!==sender.url) return false;
                                    if(page.team._id===request.oldTeam){
                                        return page.notes.some(function(note,index){
                                            if(note._id===request.noteId){
                                                page.notes[index] = res.note;
                                                return true;
                                            }
                                            return false;
                                        });
                                    }
                                    return false;
                                });
                            }else{
                                pages.some(function(page){
                                    if(page.url!==sender.url) return false;
                                    if(page.team._id===request.oldTeam){
                                        return page.notes.some(function(note,index){
                                            if(note._id===request.noteId){
                                                page.notes.splice(index,1);
                                                return true;
                                            }
                                            return false;
                                        });
                                    }
                                    return false;
                                });
                                if(!res.page){
                                    pages.some(function(page){
                                        if(page.url!==sender.url) return false;
                                        if(page.team._id===request.newTeam){
                                            page.notes.push(res.note);
                                            return true;
                                        }
                                        return false;
                                    });
                                }else{
                                    res.page.notes[0] = res.note;
                                    pages.push(res.page);
                                }
                            }
                            sendResponse(res.note);
                        });
                    }

                });
                return true;

        }
    });
})();