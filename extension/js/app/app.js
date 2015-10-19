'use strict';
window.app = angular.module('WebNotes', ['ui.router', 'ui.bootstrap', 'fsaPreBuilt', 'ngAnimate', 'ngMaterial']);

app.config(function($urlRouterProvider, $locationProvider) {
  // This turns off hashbang urls (/#about) and changes it to something normal (/about)
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
  $urlRouterProvider.otherwise('/');

  $urlRouterProvider.when('/auth/:provider', function() {
    window.location.reload();
  });
});

// This app.run is for controlling access to specific states.
app.run(function($rootScope, AuthService, $state, BackgroundFactory) {

  // The given state requires an authenticated user.
  var destinationStateRequiresAuth = function(state) {
    return state.data && state.data.authenticate;
  };

  $rootScope.isLoggedIn = false;

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
    // why is this empty?
  });

});
