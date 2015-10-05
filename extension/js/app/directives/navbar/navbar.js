app.directive('navBar', function($rootScope, $state, BackgroundFactory, $log, ExtensionFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: '/js/app/directives/navbar/navbar.html',
        link: function(scope) {

            scope.items = [{
                label: 'Home',
                state: 'webnote'
            }, {
                label: 'Manage Circles',
                state: 'circles'
            }, {
                label: 'Account Management',
                state: 'account'
            }];

            scope.user;

            $rootScope.$on('nicknameChange', function(event, nickname) {
                if (scope.user) {
                    scope.user.nickname = nickname;
                };
            })
            scope.logout = function() {
                BackgroundFactory.logOutUser()
                    .then(function(statusCode) {
                        $state.go('login');
                        $rootScope.isLoggedIn = false;
                        scope.user = null;
                    })
                    .catch(function(err) {
                        $log.warn(err);
                    })
            };

            var showUserOnNavbar = function() {
                BackgroundFactory.checkLoggedIn()
                    .then(function(response) {
                        var userLoggedIn = response.user;
                        scope.user = userLoggedIn;
                        return userLoggedIn;
                    }).then(function(user) {
                        ExtensionFactory.getPages(user).then(function(pages) {
                            //console.log(pages);
                            scope.pages = pages;
                        });
                    })
                    .catch(function(err) {
                        $log.warn(err);
                    })
            };

            showUserOnNavbar();
        }
    };
});