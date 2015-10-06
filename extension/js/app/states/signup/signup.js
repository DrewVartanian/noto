app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/app/states/signup/signup.html',
        controller: 'signupController'
    });

});

app.controller('signupController', function ($scope, BackgroundFactory, $state, $rootScope) {

    $scope.signup = {};
    $scope.alerts = [];

    var backgroundPage = BackgroundFactory.getBackgroundPage();
    var currentUser = backgroundPage.user;

    // function validateEmail(email) {
    //     var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    //     return re.test(email);
    // }

    $scope.sendSignup = function (signupInfo) {
        if(signupInfo.password !== signupInfo.emailvalid) {
            $scope.alerts.push({
                msg: "Passwords do not match",
                type: 'danger'
            });
        }

        BackgroundFactory.registerUser(signupInfo)
        .then(function (userInfo) {
            currentUser.setLoggedInUser(userInfo);
            $rootScope.isLoggedIn = true;
            $state.go('webnote');
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

