app.config(function ($stateProvider) {

    $stateProvider.state('webnote', {
        url: '/webnote',
        templateUrl: 'js/app/states/webnote/webnote.html',
        controller: 'WebnoteCtrl',
        resolve: {
            theUser: function (BackgroundFactory) {
              return BackgroundFactory.getLoggedInUser();
            }
        }
    });

});


app.controller('WebnoteCtrl', function ($scope, BackgroundFactory, $state, ExtensionFactory, theUser) {

    // $scope.login = {};
    // $scope.error = null;
    $scope.user = theUser;

    $scope.logout = function () {
        BackgroundFactory.logOutUser().then(function() {
            $scope.user = '';
            $state.go('login');
        });
        console.log("LOGGED ME OUT!");
    };

});