app.factory('PageFactory', function($http, BackgroundFactory) {

  return {
    getMyPages: function() {
      return BackgroundFactory.getBackgroundPage().pagesProm;
    }
  };

});
