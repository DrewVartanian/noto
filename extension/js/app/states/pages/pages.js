app.config(function ($stateProvider) {

    $stateProvider.state('pages', {
        url: '/pages',
        templateUrl: 'js/app/states/pages/pages.html',
        controller: 'pagesController',
        resolve: {
          pages: function(PageFactory){
            console.log('resolving pages');
            return PageFactory.getMyPages().then(function(pages){
              console.log('page resolved');
              console.log(pages);
              return pages;
            });
          },
          teams: function(TeamFactory){
            return TeamFactory.getMyTeams();
          }
        }
    });

});

app.controller('pagesController', function ($scope, PageFactory, TeamFactory, BackgroundFactory,pages,teams,StateFactory) {

    StateFactory.state.name='pages';
    $scope.pages = pages;
    console.log('controller pages',pages);

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

    $scope.oneAtATime = true;

    $scope.groups = [
      {
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
      },
      {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
      }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
      var newItemNo = $scope.items.length + 1;
      $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };

    $scope.setTeam = function (teamname){
      console.log("teamname: ", teamname);
      BackgroundFactory.setTeamViewOnLinkVisit(teamname)
    };

});
