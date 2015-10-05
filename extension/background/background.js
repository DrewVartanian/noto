var toggle = false;
var pages;
getPages();
chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !toggle;
  if(toggle){
    chrome.browserAction.setIcon({path: "robit_19.png", tabId:tab.id});
  }
  else{
    chrome.browserAction.setIcon({path: "robit_sleep_19.png", tabId:tab.id});
    chrome.tabs.executeScript(tab.id, {code:"alert()"});
  }
});

console.log('background js');
// Create rightclick context menu "Add New Note" option
chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Add New Note";
  var id = chrome.contextMenus.create({"title": title,"contexts":["all"]});
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
  chrome.tabs.sendRequest(tab.id, "getClickedEl", function(clickedEl) {
        Promise.resolve($.post('http://localhost:1337/api/note',clickedEl)).then(function(res){
          console.log('response: ',res);
          console.log('response data: ',res.data);
        }).then(null,function(){});
        // console.dir(clickedEl);
    });
  // var sText = info.selectionText;
  // var url = "https://www.google.com/search?q=" + encodeURIComponent(sText);
  // window.open(url, '_blank');
}

function getPages(){
  Promise.resolve($.get('http://localhost:1337/api/page')).then(function(mongoPages){
    console.log('pages received',mongoPages);
    mongoPages=pages;
  });
}

var user = new User();

var encryptionState = new ControlEncryption();

/////////////////////   USER STATE  /////////////////////

function User (userInfo) {

    var myCircles = [],
    email = "",
    nickname = "",
    picUrl = "",
    selectedCircle = {
        _id: "",
        name: "",
        creator: "",
        members: [],
        key: ""
    };

    this.setLogOutUser = function () {

        myCircles = [];
        email = '';
        nickname = '';
        picUrl = '';
        selectedCircle = {
            _id: "",
            name: "",
            creator: "",
            members: [],
            key: ""
        };

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

    this.setSelectedCircle = function (circle) {

        selectedCircle._id = circle._id;
        selectedCircle.name = circle.name;
        selectedCircle.creator = circle.creator;
        selectedCircle.members = circle.members;
        selectedCircle.key = circle.key;

        sendSelectedCircle(selectedCircle);
    };

    this.getSelectedCircle = function () {
        return selectedCircle;
    };

    this.getSelectedCircleKey = function () {
        return selectedCircle.key;
    };

    this.isLoggedIn = function () {
        return !!email;
    };
} //END OF USER

/////////////////////   ENCRYPTION STATE  /////////////////////

function ControlEncryption () {

    var toggleState = false;

    this.toggle = function () {
        toggleState = !toggleState;
    };

    this.turnOff = function () {
        toggleState = false;
    };

    this.turnOn = function () {
        toggleState = true;
    };

    this.getState = function () {
        return toggleState;
    };
}

/////////////////////   LISTEN FOR REFRESH  /////////////////////

chrome.runtime.onMessage.addListener(function (message, sender) {

    if (message.message === 'get-extension-session-status') {
        updateExtScriptState();
    }
});

/////////////////////   HELPER FUNCTIONS  /////////////////////
function processLogout () {
    encryptionState.turnOff();
    sendToContentScript('process-logout');
}

function sendSelectedCircle (circle) {
    sendToContentScript('set-encryption-circle', circle);
}

function updateExtScriptState () {

    var payload = {
        userCircles: user.getLoggedInUser().myCircles,
        encryptionState: encryptionState.getState(),
        selectedCircle: user.getSelectedCircle(),
        isLoggedIn: user.isLoggedIn()
    };

    sendToContentScript('update-state', payload);
}

function processLogin (userCircles) {
    sendToContentScript('process-login', userCircles);
}

function encryptionToggle () {
    encryptionState.toggle();
    sendToContentScript('toggle-encryption');
}

function sendToContentScript (command, payload) {

    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendMessage(tab.id, {command: command, payload: payload});
    });
}