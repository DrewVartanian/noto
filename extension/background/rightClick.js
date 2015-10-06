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
          chrome.tabs.sendMessage(tab.id, {title: "newNote", note: res});
        }).then(null,function(){});
    });
}