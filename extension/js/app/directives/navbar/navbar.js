app.directive('navBar', function($rootScope, $state, BackgroundFactory, $log) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: '/js/app/directives/navbar/navbar.html',
        link: function(scope) {

            scope.user;

            scope.logout = function() {
                BackgroundFactory.logOutUser()
                    .then(function(statusCode) {
                        $state.go('login');
                        $rootScope.isLoggedIn = false;
                        scope.user = null;
                    })
                    .catch(function(err) {
                        $log.warn(err);
                    });
            };

            var showUserOnNavbar = function() {
                BackgroundFactory.checkLoggedIn()
                    .then(function(response) {
                        var userLoggedIn = response.user;
                        scope.user = userLoggedIn;
                    })
                    .catch(function(err) {
                        $log.warn(err);
                    });
            };

            showUserOnNavbar();
        }
    };
});
