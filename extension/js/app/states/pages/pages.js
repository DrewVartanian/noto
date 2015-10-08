app.config(function ($stateProvider) {

    $stateProvider.state('pages', {
        url: '/pages',
        templateUrl: 'js/app/states/pages/pages.html',
        controller: 'pagesController'
    });

});

app.controller('pagesController', function ($scope) {
   
    console.log("are those rootscope pages?", pages);
      $scope.pages = pages;
      // pages.forEach(function(page){
      //   $scope.pages.push(page);
      // })

 console.log($scope.pages);


});
