
app.config(function ($stateProvider) {

    $stateProvider.state('edit', {
        url: '/edit/:id',
        templateUrl: 'js/app/states/edit/edit.html',
        controller: 'editController',
        resolve: {
            pages: function(UserFactory) {
                return UserFactory.getPages();
            },
            users: function(TeamFactory, $stateParams) {
                return TeamFactory.getTeamMembers($stateParams.id);
            },
            allusers: function(UserFactory) {
                return UserFactory.getAllUsers();
            }
        }
    });

});

app.controller('editController', function ($scope, BackgroundFactory, TeamFactory, $state, $rootScope, pages, $stateParams, users, allusers) {
    $scope.alerts = [];
    $scope.pages = pages;
    $scope.teamId = $stateParams.id;
    $scope.team = users;
    $scope.everySingleUser = allusers;
    $scope.teamPages = pages.filter(function(page){
        return (page.team._id === $scope.teamId);
    });


    $scope.addNewTeamMember = function(teamId, userObj, teamObj){
        var userToPush =  _.cloneDeep(userObj);
      var email;
      var teamName;
      if(userObj) email = userObj.email; else email = null;
        if(teamObj) teamName = teamObj.name; else teamName = $scope.team.name;
        var isDuplicate = false;
        $scope.team.users.forEach(function(user){
            if(user.email === email){
                $scope.alerts.push({
                    msg: "User is already part of the team",
                    type: 'danger'
                });
                isDuplicate = true;
            }
        })
        if(isDuplicate) return;
        TeamFactory.updateTeam(teamId, {name: teamName, userEmail: email }).then(function(returnedTeam) {
              //$scope.team.name = returnedTeam.name;
            if(returnedTeam.users.length > $scope.team.users.length) { 
                console.log("what is userToPush", userToPush);
                $scope.team.users.push(userToPush);
                $scope.team.name = returnedTeam.name;
            }
            else if($scope.team.name !== returnedTeam.name){
                $scope.team.name = returnedTeam.name;
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

