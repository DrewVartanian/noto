(function(){
    function getDbInfo(){
        chrome.runtime.sendMessage({title: "newPage"},function(dbInfo){
            GLOBALS_WEB_NOTES.teamList = dbInfo.teams;
            GLOBALS_WEB_NOTES.user = dbInfo.user;
            dbInfo.pages.forEach(function(page){
                page.notes.forEach(function(note){
                    GLOBALS_WEB_NOTES.renderNote(note,page.team);
                });
            });
            if(dbInfo.teamSelected==='All Teams'){
                GLOBALS_WEB_NOTES.team={name:"personal"};
            }else{
                if(!dbInfo.teams.some(function(team){
                    if(team.name===dbInfo.teamSelected){
                        GLOBALS_WEB_NOTES.team=team;
                        return true;
                    }
                })){
                    GLOBALS_WEB_NOTES.team={name:"personal"};
                }
            }
        });
        chrome.runtime.sendMessage({title: "unreadPage"});
    }
    getDbInfo();

    document.addEventListener("mousedown", function(event){
        //right clickteam
        if(event.button == 2) {
            GLOBALS_WEB_NOTES.clickedEl = event.target;
            GLOBALS_WEB_NOTES.offset.x = 100*event.pageX/$(document).width();
            GLOBALS_WEB_NOTES.offset.y = event.pageY;
        }
    }, true);


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request == "newNoteClick") {
        var team;
        var data = {team: GLOBALS_WEB_NOTES.team._id?GLOBALS_WEB_NOTES.team._id:"personal",
            url:document.URL,
            x: GLOBALS_WEB_NOTES.offset.x,
            y: GLOBALS_WEB_NOTES.offset.y
        };
        if(GLOBALS_WEB_NOTES.user.email){
            data.message='-'+GLOBALS_WEB_NOTES.user.email.slice(0,GLOBALS_WEB_NOTES.user.email.indexOf('@'))+": ";
        }
        sendResponse(data);
    }
});


    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch(request.title){
            case 'newNote':
                var team={};
                if(GLOBALS_WEB_NOTES.team._id){
                    team.name=GLOBALS_WEB_NOTES.team.name;
                }else{
                    team.name="personal";
                    GLOBALS_WEB_NOTES.team._id = request.teamId;
                }
                team._id=request.teamId;
                GLOBALS_WEB_NOTES.renderNoteForm(request.note,team);
                break;
            case 'noteChangedOnBackground':
                switch(request.data.oper){
                    case 'delete':
                        GLOBALS_WEB_NOTES.unrenderNote(request.data.note);
                        break;
                    case 'put':
                        GLOBALS_WEB_NOTES.unrenderNote(request.data.note._id);
                        GLOBALS_WEB_NOTES.teamList.some(function(team){
                            if(request.data.team===team._id){
                                request.data.team=team;
                                return true;
                            }
                        });
                        GLOBALS_WEB_NOTES.renderNote(request.data.note,request.data.team);
                        break;
                }
                break;
            case 'changeTeam':
                GLOBALS_WEB_NOTES.clearNotes();
                getDbInfo();
                break;
            case 'logout content':
                console.log('logout test');
                GLOBALS_WEB_NOTES.clearNotes();
                GLOBALS_WEB_NOTES.team={name:"All Teams"};
                GLOBALS_WEB_NOTES.clickedEl= null;
                GLOBALS_WEB_NOTES.offset= {};
                GLOBALS_WEB_NOTES.teamList=[];
                break;
            case 'login content':
                console.log('login test');
                GLOBALS_WEB_NOTES.clearNotes();
                GLOBALS_WEB_NOTES.team={name:"All Teams"};
                GLOBALS_WEB_NOTES.clickedEl= null;
                GLOBALS_WEB_NOTES.offset= {};
                GLOBALS_WEB_NOTES.teamList=[];
                getDbInfo();
                break;
        }
    });
})();
