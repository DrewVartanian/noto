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
//   var activated = new Boolean();
//   chrome.pageAction.onClicked.addListener(function(tab) { 
//  if(!activated){
//         chrome.pageAction.setIcon({tabId: tab.id, path: 'icons/rotate-symbol.png'});
//         activated = true;
//         alert("activated");
//     }else{
//         chrome.pageAction.setIcon({tabId: tab.id, path: 'icons/rotate-symbol.png'});
//         activated = false;
//         alert("not activated");
//     }
// });
})();