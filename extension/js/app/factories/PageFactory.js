app.factory('PageFactory', function ($http) {

    var server = 'http://127.0.0.1:1337';

    var composeRequest = function (method, url, data) {
        return {
            method: method,
            url: server + url,
            data: data
        };
    };

    return {
        // note: this route uses req.user. re-wire to currentUser?
        getMyPages: function() {
            return $http(composeRequest('GET', '/api/page/user'))
            .then(function (response){
                return response.data;
            });
        }
    };

});
