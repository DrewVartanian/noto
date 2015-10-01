var toggle = false;
chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !toggle;
  if(toggle){
    chrome.browserAction.setIcon({path: "robit_19.png", tabId:tab.id});
    // chrome.tabs.executeScript(tab.id, {file:"SCRIPT.user.js"});
  }
  else{
    chrome.browserAction.setIcon({path: "robit_sleep_19.png", tabId:tab.id});
    chrome.tabs.executeScript(tab.id, {code:"alert()"});
  }
});

chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Add New Note";
  var id = chrome.contextMenus.create({"title": title,"contexts":["all"]});
  alert('addListener');
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
  alert('onClickHandler');
  var sText = info.selectionText;
  var url = "https://www.google.com/search?q=" + encodeURIComponent(sText);
  window.open(url, '_blank');
};
