app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/app/states/login/login.html',
        controller: 'loginController'
    });

});

app.controller('loginController', function ($rootScope, $scope, BackgroundFactory, $state, $window, $location, $log, AuthService) {
    $scope.login = {};
    $scope.loggedInUser = {};
    $scope.alerts = [];

    var backgroundPage = BackgroundFactory.getBackgroundPage();
    var currentUser = backgroundPage.user;

    function checkUserLoggedIn() {
        BackgroundFactory.checkLoggedIn()
        .then(function (response) {
            if(response) {
            var userLoggedIn = response.user;
                currentUser.setLoggedInUser(userLoggedIn);
                $rootScope.isLoggedIn = true;
                $state.go('pages');
            } else {
                currentUser.setLogOutUser();
                $rootScope.isLoggedIn = false;
                $state.go('webnote');
            }
        })
        .catch(function (err) {
            $log.warn('No user logged in.');
        });
    };

    checkUserLoggedIn();
    $rootScope.hidelanding = false;

    $scope.sendLogin = function (loginInfo) {
        $scope.error = null;

        BackgroundFactory.logInUser(loginInfo)
        .then(function (userInfo) {
            $rootScope.isLoggedIn = true;
            $state.go('pages');
        })
        .catch(function (err) {
            $scope.alerts.push({
                msg: err.data || 'no err msg',
                type: 'danger'
            });
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };


});
