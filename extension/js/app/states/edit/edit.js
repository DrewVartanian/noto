app.config(function ($stateProvider) {

    $stateProvider.state('edit', {
        url: '/edit/:id',
        templateUrl: 'js/app/states/edit/edit.html',
        controller: 'editController',
        resolve: {
            pages: function(ExtensionFactory) {
                return ExtensionFactory.getPages();
            },
            users: function(TeamFactory, $stateParams) {
                return TeamFactory.getTeamMembers($stateParams.id);
            }
        }
    });

});

app.controller('editController', function ($scope, BackgroundFactory, TeamFactory, $state, $rootScope, pages, $stateParams, users) {
    $scope.alerts = [];
    $scope.pages = pages;
    $scope.teamId = $stateParams.id;
    $scope.team = users;
    
    $scope.teamPages = pages.filter(function(page){
        return (page.team._id === $scope.teamId);
    });


    $scope.addNewTeamMember = function(teamId, userObj){
        var email = userObj.email;
        $scope.team.users.forEach(function(user){
            if(user.email === email){
                $scope.alerts.push({
                    msg: "User is already part of the team",
                    type: 'danger'
                });
            }
        })

        TeamFactory.updateTeam(teamId, {userEmail: email}).then(function(returnedTeam) {
            if(returnedTeam) { 
                if(returnedTeam.users.length > $scope.team.users.length){
                    $scope.team.users.push(userObj);
                }
            }

            else {

                $scope.alerts.push({
                msg: "User Not Found",
                type: 'danger'
            });
            }
        }).then($scope.checktoggle());
    };

    $scope.deleteMember = function(teamId, userId){
        TeamFactory.deleteTeamMember(teamId, userId).then(function (team) {
            console.log("this is the team", team);
        })
        .then(function() {
            $scope.team.users = $scope.team.users.filter(function (user) {
               return user._id !== userId;
            });
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.checktoggle = function() {
        if($scope.alerts[0] === undefined) {
            $scope.toggleEdit = !$scope.toggleEdit;
        }
    };
});

