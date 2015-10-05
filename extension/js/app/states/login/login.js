app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/app/states/login/login.html',
        controller: 'loginController'
    });

});

app.controller('loginController', function ($rootScope, $scope, BackgroundFactory, $state, $window, $location, $log) {
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
                $state.go('webnote');
            } else {
                currentUser.setLogOutUser();
                $rootScope.isLoggedIn = false;
                $state.go('login');
            }
        })
        .catch(function (err) {
            $log.warn('No user logged in.');
        })
    };

    checkUserLoggedIn();

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        BackgroundFactory.logInUser(loginInfo)
        .then(function (userInfo) {
            $rootScope.isLoggedIn = true;
            $state.go('webnote');
        })
        .catch(function (err) {
            $scope.alerts.push({
                msg: err.data || 'no err msg',
                type: 'danger'
            });
        })
    };


});