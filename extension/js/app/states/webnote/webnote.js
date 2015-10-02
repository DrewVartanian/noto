app.config(function ($stateProvider) {

    $stateProvider.state('webnote', {
        url: '/webnote',
        templateUrl: 'js/app/states/webnote/webnote.html',
        controller: 'WebnoteCtrl'
    });

});

app.controller('WebnoteCtrl', function ($scope, AuthService, $state) {

    // $scope.login = {};
    // $scope.error = null;

    

    AuthService.getLoggedInUser().then(function(user){
        $scope.user = user;
    })

    // $scope.sendLogin = function (loginInfo) {

    //     $scope.error = null;

    //     AuthService.login(loginInfo).then(function () {
    //         $state.go('home');
    //     }).catch(function () {
    //         $scope.error = 'Invalid login credentials.';
    //     });

    // };

});