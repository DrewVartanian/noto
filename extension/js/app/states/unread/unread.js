app.config(function($stateProvider) {

  $stateProvider.state('unread', {
    url: '/unread',
    templateUrl: 'js/app/states/unread/unread.html',
    controller: 'unreadController',
    resolve: {
      unreadPages: function(UserFactory) {
        return UserFactory.getUnreadPages();
      }
    }
  });

});

app.controller('unreadController', function($scope, unreadPages, PageFactory, TeamFactory, BackgroundFactory, StateFactory) {
  StateFactory.state.name = 'unread';
  $scope.unreadPages = unreadPages;

  $scope.setTeam = function() {
    BackgroundFactory.setTeamViewOnLinkVisit("All Teams");
  };

});
