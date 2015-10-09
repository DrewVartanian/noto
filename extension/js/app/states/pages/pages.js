app.config(function ($stateProvider) {

    $stateProvider.state('pages', {
        url: '/pages',
        templateUrl: 'js/app/states/pages/pages.html',
        controller: 'pagesController'
    });

});

app.controller('pagesController', function ($scope, PageFactory, TeamFactory) {

      PageFactory.getMyPages().then(function(pages){
        $scope.pages = pages;
      });

      TeamFactory.getMyTeams().then(function(teams){
        // note: assumes the promise above returns array of unique teams
        $scope.teams = teams;
        console.log("before adding the pages for teams ", $scope.teams);

        $scope.teams.forEach(function(team){
            team.pages = [];
            $scope.pages.forEach(function(page){
              if(page.team._id === team._id){
                team.pages.push(page);
              }
            });

        });
        console.log("after ",$scope.teams);
        //populate team with array of pages
      //   $scope.pages.forEach(function(page){
      //     console.log("before adding pages, the original pages ",page);
      //       $scope.teams.forEach(function(team) {
      //         team.pages = [];
      //         if(page.team._id === team._id){
      //           team.pages.push(page);
      //         }
      //       });
      //   });
      //   console.log("after ",$scope.teams);
      });


});
