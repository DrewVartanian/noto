function refresh(f) {
  if ((/in/.test(document.readyState))) {
    setTimeout('refresh(' + f + ')', 1);
  } else {
    f();
  }
}

var main = function() {
  var userLoggedIn;

  document.addEventListener('process-logout', function(e) {
    userLoggedIn = false;
  });

  document.addEventListener('process-login', function(e) {
    userLoggedIn = true;
  });

};



function sendToContentScript(data) {
  document.dispatchEvent(new CustomEvent('messageFromExternal', {
    detail: data
  }));
}

refresh(main);
