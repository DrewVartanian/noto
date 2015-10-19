app.config(function($stateProvider) {

  $stateProvider.state('webnote', {
    url: '/',
    templateUrl: 'js/app/states/webnote/webnote.html',
    controller: 'loginController',
    resolve: {
      theUser: function(BackgroundFactory) {
        return BackgroundFactory.getLoggedInUser();
      }
    }
  });

});

