// this is a draft file based on CryptoVeil's BackgroundFactory example


app.factory('BackgroundFactory', function($http, $q) {

  var backgroundPage = chrome.extension.getBackgroundPage();
  var currentUser = backgroundPage.user;
  var server = 'http://127.0.0.1:1337';

  var composeRequest = function(method, url, data) {
    return {
      method: method,
      url: server + url,
      data: data
    };
  };

  var setUser = function(info) {
    currentUser.setLoggedInUser(info);
    return currentUser.getLoggedInUser();
  };

  return {

    getBackgroundPage: function() {
      return chrome.extension.getBackgroundPage();
    },

    signUpUser: function(info) {
      return $http(composeRequest('POST', '/signup', {
          email: info.email,
          password: info.password
        }))
        .then(function(response) {
          var registeredUser = response.data.user;
          setUser(registeredUser);
          return registeredUser;
        });
    },

    logInUser: function(info) {
      return $http(composeRequest('POST', '/login', {
          email: info.email,
          password: info.password
        }))
        .then(function(response) {
          var returnedUser = response.data.user;
          setUser(returnedUser);
          return returnedUser;
        });
    },

    logOutUser: function() {
      return $http(composeRequest('GET', '/logout'))
        .then(function(response) {
          // chrome.browserAction.setIcon({
          //   path: "/icons/robit_sleep.png"
          // });
          currentUser.setLogOutUser();
          return response.status;
        });
    },

    // checkLoggedIn: function() {
    //   return $http(composeRequest('GET', '/session'))
    //     .then(function(response) {
    //       return response.data;
    //     });
    // },

    isLoggedIn: function() {
      return backgroundPage.user.isLoggedIn();
    }
  };
});
