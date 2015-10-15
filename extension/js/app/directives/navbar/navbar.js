app.directive('navBar', function($rootScope, $state, BackgroundFactory, $log, UserFactory,StateFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: '/js/app/directives/navbar/navbar.html',
        link: function(scope) {

            // scope.user;
            scope.welcome=UserFactory.welcome;
            scope.state=StateFactory.state;

            scope.logout = function() {
                BackgroundFactory.logOutUser()
                    .then(function(statusCode) {
                        $rootScope.isLoggedIn = false;
                        $rootScope.hidelanding = false;
                        $rootScope.user = null;
                        $state.go('webnote');
                        scope.welcome.user='';
                    })
                    .catch(function(err) {
                        $log.warn(err);
                    });
            };

            scope.refresh = function() {
                console.log("Inside refresh function");
                chrome.runtime.sendMessage({title: "login"},function(){});
            };

            var showUserOnNavbar = function() {
                BackgroundFactory.checkLoggedIn()
                    .then(function(response) {
                        var userLoggedIn = response.user;
                        // scope.user = userLoggedIn;
                        scope.welcome.user = userLoggedIn.email.substr(0,userLoggedIn.email.indexOf('@'));

                    })
                    .catch(function(err) {
                        $log.warn(err);
                    });
            };

            showUserOnNavbar();

        }
    };
});
