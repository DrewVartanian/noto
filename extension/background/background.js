var toggle = false;
var pagesProm=getPages();

chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !toggle;
  if(toggle){
    chrome.browserAction.setIcon({path: "/icons/robit_19.png", tabId:tab.id});
  }
  else{
    chrome.browserAction.setIcon({path: "/icons/robit_sleep_19.png", tabId:tab.id});
    chrome.tabs.executeScript(tab.id, {code:"alert()"});
  }
});

// create rightclick context menu "Add New Note" option
chrome.contextMenus.create({
    "title": "Add New Note",
    "contexts":["all"],
    "onclick": onClickHandler
});

// context menu onclick callback function
function onClickHandler(info, tab) {
  chrome.tabs.sendRequest(tab.id, "getClickedEl", function(clickedEl) {
        Promise.resolve($.post('http://127.0.0.1:1337/api/note',clickedEl)).then(function(res){
          console.log('response: ',res);
          //console.log('response data: ',res.data);
          chrome.runtime.sendMessage(tab.id, {title: "newNote", note: res});
        }).then(null,function(){});
        // console.dir(clickedEl);
    });
}

function getPages(){
  return Promise.resolve($.get('http://127.0.0.1:1337/api/page')).then(function(mongoPages){
    console.log('pages received',mongoPages);
    return mongoPages;
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request==='newPage'){
        console.log('loading notes');
        pagesProm.then(function(pages){
            console.log(pages);
            if(pages.every(function(page){
                console.log('checking: '+page.url);
                if(page.url===sender.url){
                    console.log('Match: '+page.url);
                    console.log(page.notes);
                    sendResponse(page.notes);
                    return false;
                }
                return true;
            })){
                console.log('send empty');
                sendResponse([]);
            }
        });
        return true;
    }
});

// Cryptoveil modified copypasta below
/////////////////////  USER STATE  /////////////////////
var user = new User();

function User (userInfo) {

    var email = "",
        name = "";

    this.setLogOutUser = function () {
        email = "",
        name = "";
        processLogout();
    };

    this.setLoggedInUser = function (user) {
        email = user.email;
        name = user.name;

        processLogin(user);
    };

    this.getLoggedInUser = function () {
        return {
            email: email,
            name: name
        };
    };

    this.isLoggedIn = function () {
        return !!email;
    };
} // END OF USER


/////////////////////  Content Script Message Handling  /////////////////////

chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message.message === 'get-extension-session-status') {
        updateExtScriptState();
    }
});

/////////////////////  HELPER FUNCTIONS  /////////////////////
function processLogout () {
    sendToContentScript('process-logout');
}

function updateExtScriptState () {
    var payload = {
        isLoggedIn: user.isLoggedIn()
    };
    sendToContentScript('update-state', payload);
}

function processLogin () {
    sendToContentScript('process-login');
}

function sendToContentScript (command, payload) {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendMessage(tab.id, {command: command, payload: payload});
    });
}
