app.factory('BackgroundFactory', function ($http, $q, RequestFactory) {

    var getBackgroundPage = function () {
        return chrome.extension.getBackgroundPage().GLOBALS;
    };


    var backgroundPage = getBackgroundPage();
    var currentUser = backgroundPage.user;

    var setUser = function(info) {
        currentUser.setLoggedInUser(info);
        return currentUser.getLoggedInUser();
    };

    return {

        getBackgroundPage: getBackgroundPage,


        registerUser: function(signUpInfo) {
            return $http(RequestFactory.composeRequest('POST','/signup', { name: signUpInfo.name, email: signUpInfo.email, password: signUpInfo.password }))
            .then(function (response) {
                var registeredUser = response.data.user;
                setUser(registeredUser);
                console.log("this is the user u get back!", registeredUser)
                return registeredUser;
            });
        },

        logInUser: function(info) {
            return $http(RequestFactory.composeRequest('POST', '/login', { email: info.email, password: info.password }))
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
                chrome.runtime.sendMessage({title: "login"},function(){});
                return returnedUser;
            });
        },

        logOutUser: function() {
            return $http(RequestFactory.composeRequest('GET', '/logout'))
            .then(function (response) {
                chrome.tabs.query({title: 'WebNotes'}, function (tabs) {
                    if (tabs) {
                        tabs.forEach(function(tab) {
                            chrome.tabs.reload(tab.id)
                        });
                    };
                });
                console.log("before sendMessage");
                chrome.runtime.sendMessage({title: "logout"},function(){});
                 console.log("after sendMessage");
                currentUser.setLogOutUser();
                return response.status;
            });

        },

        checkLoggedIn: function() {
            return $http(RequestFactory.composeRequest('GET', '/session'))
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
