app.config(function($stateProvider) {

    $stateProvider.state('unread', {
        url: '/unread',
        templateUrl: 'js/app/states/unread/unread.html',
        controller: 'unreadController',
        resolve: {
            unreadPages: function(UserFactory) {
                return UserFactory.getUnreadPages()
            }
        }
    });

});

app.controller('unreadController', function($scope, unreadPages, PageFactory, TeamFactory) {
    $scope.unreadPages = unreadPages;

    // PageFactory.getMyPages().then(function(pages) {
    //     $scope.pages = pages;
    // });

    // TeamFactory.getMyTeams().then(function(teams) {
    //     // note: assumes the promise above returns array of unique teams
    //     $scope.teams = teams;
    //     console.log("before adding the pages for teams ", $scope.teams);

    //     $scope.teams.forEach(function(team) {
    //         team.pages = [];
    //         $scope.pages.forEach(function(page) {
    //             if (page.team._id === team._id) {
    //                 team.pages.push(page);
    //             }
    //         });

    //     });


    // });


});
