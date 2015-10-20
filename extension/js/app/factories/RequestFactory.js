app.factory('RequestFactory', function() {

  var server = 'http://127.0.0.1:1337';
  // var server = 'https://hidden-everglades-5386.herokuapp.com';

  return {
    composeRequest: function(method, url, data) {
      return {
        method: method,
        url: server + url,
        data: data
      };
    }
  };

});
