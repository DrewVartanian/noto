// what does this file do & why does it need to be included in web_accessible_resources?

function refresh(f) {
  if( (/in/.test(document.readyState))) {
    setTimeout('refresh(' + f + ')', 1);
  } else {
    f();
  }
}

var main = function () {
	var userLoggedIn;

	document.addEventListener('process-logout', function (e) {
		userLoggedIn = false;
	});

	document.addEventListener('process-login', function (e) {
		userLoggedIn = true;
	});

}; //END main



function sendToContentScript (data) {
	document.dispatchEvent(new CustomEvent('messageFromExternal', { detail: data }));
}

refresh(main);

