app.config(function ($stateProvider) {

    $stateProvider.state('pages', {
        url: '/',
        templateUrl: 'js/app/states/pages/pages.html',
        controller: 'pagesController'
    });

});

app.controller('pagesController', function ($scope, PageFactory) {
   
    console.log("are those rootscope pages?", pages);
      $scope.pages = PageFactory.getMyPages().then(function(pages){
        $scope.pages = pages;
        
      })
      // pages.forEach(function(page){
      //   $scope.pages.push(page);
      // })
      $scope.teams = teams;

 console.log($scope.pages);
 console.log($scope.teams);

});
