(function() {
  GLOBALS.user = new User();

  function User(userInfo) {

    var email = "",
      name = "";

    this.setLogOutUser = function() {
      email = "",
        name = "";
      processLogout();
    };

    this.setLoggedInUser = function(user) {
      email = user.email;
      name = user.name;

      processLogin(user);
    };

    this.getLoggedInUser = function() {
      return {
        email: email,
        name: name
      };
    };

    this.isLoggedIn = function() {
      return !!email;
    };
  }

  chrome.runtime.onMessage.addListener(function(message, sender) {
    if (message.message === 'get-extension-session-status') {
      updateExtScriptState();
    }
  });

  function processLogout() {
    sendToContentScript('process-logout');
  }

  function updateExtScriptState() {
    var payload = {
      isLoggedIn: user.isLoggedIn()
    };
    sendToContentScript('update-state', payload);
  }

  function processLogin() {
    sendToContentScript('process-login');
  }

  function sendToContentScript(command, payload) {
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, {
        command: command,
        payload: payload
      });
    });
  }
})();
