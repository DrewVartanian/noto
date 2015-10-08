app.factory('BackgroundFactory', function ($http, $q) {

    var backgroundPage = chrome.extension.getBackgroundPage();
    var currentUser = backgroundPage.user;
    var server = 'http://127.0.0.1:1337';

    var composeRequest = function (method, url, data) {
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

        getBackgroundPage: function () {
            return chrome.extension.getBackgroundPage();
        },


        registerUser: function(signUpInfo) {
            return $http(composeRequest('POST','/signup', { name: signUpInfo.name, email: signUpInfo.email, password: signUpInfo.password }))
            .then(function (response) {
                var registeredUser = response.data.user;
                setUser(registeredUser);
                console.log("this is the user u get back!", registeredUser)
                return registeredUser;
            });
        },

        logInUser: function(info) {
            return $http(composeRequest('POST', '/login', { email: info.email, password: info.password }))
            .then(function (response) {
                chrome.tabs.query({title: 'WebNotes'}, function (tabs) {
                    if (tabs.length) {
                        tabs.forEach(function(tab) {
                            chrome.tabs.reload(tab.id)
                        });
                    };
                });

                var returnedUser = response.data.user;
                setUser(returnedUser);
                return returnedUser;
            });
        },

        logOutUser: function() {
            return $http(composeRequest('GET', '/logout'))
            .then(function (response) {
                chrome.tabs.query({title: 'WebNotes'}, function (tabs) {
                    if (tabs) {
                        tabs.forEach(function(tab) {
                            chrome.tabs.reload(tab.id)
                        });
                    };
                });

                currentUser.setLogOutUser();
                return response.status;
            });
        },

        checkLoggedIn: function() {
            return $http(composeRequest('GET', '/session'))
            .then(function (response) {
                return response.data;
            });
        },

        isLoggedIn: function () {
            return backgroundPage.user.isLoggedIn();
        },

        getLoggedInUser: function () {
            return $q.when(currentUser.getLoggedInUser());
        }
    };
});
