app.config(function($stateProvider) {

    $stateProvider.state('team', {
        url: '/team',
        templateUrl: 'js/app/states/team/team.html',
        controller: 'teamController',
        resolve: {
            pages: function(UserFactory) {
                return UserFactory.getPages()
            },
            teams: function(UserFactory) {
                return UserFactory.getTeams()
            }
        }
    });

});

app.controller('teamController', function($scope, BackgroundFactory, $state, $rootScope, pages, teams, TeamFactory) {
    $scope.alerts = [];
    $scope.pages = pages;
    $scope.teams = teams;

    $scope.createNewTeam = function(teamObject) {

        if (teamObject.name === "personal") {
            $scope.alerts.push({
                msg: "personal is a reserved team name, please choose another",
                type: 'danger'
            });
        } else {
            TeamFactory.createNewTeam(teamObject.name).then(function(team) {
                $scope.teams.push(team);
            });
        }
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };


    // $scope.signup = {};
    // $scope.alerts = [];

    // var backgroundPage = BackgroundFactory.getBackgroundPage();
    // var currentUser = backgroundPage.user;

    // // function validateEmail(email) {
    // //     var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    // //     return re.test(email);
    // // }

    // $scope.sendSignup = function (signupInfo) {
    //     if(signupInfo.password !== signupInfo.emailvalid) {
    //         $scope.alerts.push({
    //             msg: "Passwords do not match",
    //             type: 'danger'
    //         });
    //     }

    //     BackgroundFactory.registerUser(signupInfo)
    //     .then(function (userInfo) {
    //         currentUser.setLoggedInUser(userInfo);
    //         $rootScope.isLoggedIn = true;
    //         $state.go('webnote');
    //     })
    //     .catch(function (err) {
    //         $scope.alerts.push({
    //             msg: err.data || 'no err msg',
    //             type: 'danger'
    //         });
    //     });
    // };

    // $scope.closeAlert = function(index) {
    //     $scope.alerts.splice(index, 1);
    // };

});