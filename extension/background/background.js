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
                    chrome.contextMenus.removeAll();
                });
                GLOBALS.socket.emit('logout', {});
                chrome.tabs.getAllInWindow(null, function(tabs){
                    for (var i = 0; i < tabs.length; i++) {
                        chrome.tabs.sendMessage(tabs[i].id, {title: "logout content"});
                    }
                });
                break;
            case 'newPage':
                Promise.all([GLOBALS.pagesProm,GLOBALS.teamsProm]).then(function(dbInfo){
                    var pageToContent=dbInfo[0].filter(function(page){
                        if(page.url===sender.url){
                            if(GLOBALS.teamSelected==="All Teams") return true;
                            return(GLOBALS.teamSelected===page.team.name);
                        }
                        return false;
                    });
                    sendResponse({pages: pageToContent,teams: dbInfo[1], teamSelected:GLOBALS.teamSelected});
                });
                return true;
            case 'unreadPage':
                $.ajax({
                    url: GLOBALS.serverUrl+'/api/user/unreadPage',
                    type:'PUT',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        url: sender.url
                    })
                });
                break;
            case 'destroyNote':
                $.ajax({
                    url:GLOBALS.serverUrl+'/api/note/'+request.noteId,
                    type:'DELETE',
                    success: function(){
                        GLOBALS.pagesProm.then(function(pages){
                            pages.some(function(page){
                                if(page.url!==sender.url) return false;
                                return page.notes.some(function(note,index){
                                    if(note._id===request.noteId){
                                        GLOBALS.socket.emit('changeNote', {
                                          "url": sender.url,
                                          "team": page.team._id,
                                          "note": request.noteId,
                                          "oper": "delete"
                                        });
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
            case 'saveNoteSize':
            $.ajax({
                    url:GLOBALS.serverUrl+'/api/note/'+request.noteId,
                    type:'PUT',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        size: request.size,
                        url: sender.url
                    }),
                    success: function(res){
                        GLOBALS.pagesProm.then(function(pages){
                            GLOBALS.socket.emit('changeNote', {
                                        "url": sender.url,
                                        "newTeam": request.team,
                                        "oldTeam": request.team,
                                        "note": res.note,
                                        "oper": "put"
                            });
                            pages.some(function(page){
                                if(page.url!==sender.url) return false;
                                if(page.team._id!==request.team) return false;
                                return page.notes.some(function(note,index){
                                    if(note._id===request.noteId){
                                        page.notes[index] = res.note;
                                        console.log(res.note);
                                        return true;
                                    }
                                    return false;
                                });
                            });
                        });
                    }
                });
                return true;
            case 'saveNotePosition':
             $.ajax({
                    url:GLOBALS.serverUrl+'/api/note/'+request.noteId,
                    type:'PUT',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        position: request.position,
                        url: sender.url
                    }),
                    success: function(res){
                       GLOBALS.pagesProm.then(function(pages){
                            GLOBALS.socket.emit('changeNote', {
                                          "url": sender.url,
                                          "newTeam": request.team,
                                          "oldTeam": request.team,
                                          "note": res.note,
                                          "oper": "put"
                            });
                            pages.some(function(page){
                                if(page.url!==sender.url) return false;
                                if(page.team._id!==request.team) return false;
                                return page.notes.some(function(note,index){
                                    if(note._id===request.noteId){
                                        page.notes[index] = res.note;
                                        console.log(res.note);
                                        return true;
                                    }
                                    return false;
                                });
                            });
                        });
                    }
                });
                return true;
            case 'saveNote':
                console.log('request',request);
                $.ajax({
                    url:GLOBALS.serverUrl+'/api/note/'+request.noteId,
                    type:'PUT',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        message: request.message, //? request.message : undefined,
                        // size: request.size,
                        color: request.color,
                        newTeam: request.newTeam, //? request.newTeam : request.team,
                        oldTeam: request.oldTeam, //? request.oldTeam : request.team,
                        url: sender.url
                    }),
                    success: function(res){
                        console.log('res',res);
                        GLOBALS.pagesProm.then(function(pages){
                            GLOBALS.socket.emit('changeNote', {
                                          "url": sender.url,
                                          "newTeam": request.newTeam,
                                          "oldTeam": request.oldTeam,
                                          "note": res.note,
                                          "oper": "put"
                            });
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
            case "login":
                console.log("hitting teams.js");
                GLOBALS.teamsProm = GLOBALS.getTeams();
                GLOBALS.pagesProm = GLOBALS.getPages();
                GLOBALS.createRightClick();
                GLOBALS.socket.emit('login', {});
                chrome.tabs.getAllInWindow(null, function(tabs){
                    for (var i = 0; i < tabs.length; i++) {
                        chrome.tabs.sendMessage(tabs[i].id, {title: "login content"});
                    }
                });
                break;
            case "change teams":
                var data = {team:request.team};
                if(request.userId){
                    data.userId=request.userId;
                }
                GLOBALS.socket.emit('changeTeams', data);
                GLOBALS.teamsProm=GLOBALS.getTeams();
                GLOBALS.createRightClick();
                break;
            case "team link":
                console.log("Trying request.teamname", request.teamname);
                GLOBALS.teamSelected = request.teamname;
                break;
        }
    });

    Promise.resolve($.get(GLOBALS.serverUrl+'/session')).then(function(session){
        GLOBALS.createRightClick();
    }).then(null,function(){
        //no user returned;
    });
})();
