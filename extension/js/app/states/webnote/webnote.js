app.config(function ($stateProvider) {

    $stateProvider.state('webnote', {
        url: '/webnote',
        templateUrl: 'js/app/states/webnote/webnote.html',
        controller: 'WebnoteCtrl'
    });

});


app.controller('WebnoteCtrl', function ($scope, BackgroundFactory, $state, ExtensionFactory) {

    // $scope.login = {};
    // $scope.error = null;

    $scope.logout = function () {
        BackgroundFactory.logOutUser().then(function() {
            $scope.user = '';
            $state.go('login');
        });
        console.log("LOGGED ME OUT!");
    };

    BackgroundFactory.checkLoggedIn().then(function(user){
        $scope.user = user;
        return user;
    });

    // $scope.sendLogin = function (loginInfo) {

    //     $scope.error = null;

    //     AuthService.login(loginInfo).then(function () {
    //         $state.go('home');
    //     }).catch(function () {
    //         $scope.error = 'Invalid login credentials.';
    //     });

    // };

});