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

    

    BackgroundFactory.checkLoggedIn().then(function(user){
        $scope.user = user;
        return user;
    }).then(function (user){
        console.log(user);
        ExtensionFactory.getPages(user).then(function(pages){
            console.log(pages);
            $scope.pages = pages;
        });

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