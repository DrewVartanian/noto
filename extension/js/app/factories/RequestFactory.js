app.factory('RequestFactory', function (){

  var server = 'http://127.0.0.1:1337';

  return {
    composeRequest: function (method, url, data) {
        return {
            method: method,
            url: server + url,
            data: data
        };
    }
  };

});