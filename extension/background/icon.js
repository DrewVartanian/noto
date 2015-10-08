(function(){
  var toggle = false;
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
})();