app.config(function ($stateProvider) {

    $stateProvider.state('pages', {
        url: '/',
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
        //populate team with array of pages
        $scope.pages.forEach(function(page){
            $scope.teams.forEach(function(team) {
              team.pages = [];
              if(page.team._id === team._id){
                team.pages.push(page);
              }
            });
        });
console.log("what are pages in page controller?", $scope.pages);
console.log("what are teams in page controller?", $scope.teams);

});
