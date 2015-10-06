app.factory('TeamFactory', function ($http) {

    var server = 'http://127.0.0.1:1337';

    var composeRequest = function (method, url, data) {
        return {
            method: method,
            url: server + url,
            data: data
        };
    };

    return {
        // note: this route uses req.user. need to re-wire to currentUser?
        getMyPages: function() {
            return $http(composeRequest('GET', '/api/page/user'))
            .then(function (response){
                return response.data;
            });
        },

        // note: this route returns *pages* of current user with notes + team populated
        // GET all notes on a specific page for current user
        getMyNotesOnPage: function(pageURL) {
            return $http(composeRequest('GET', '/api/page/user/' + pageURL))
            .then(function (response){
                return response.data;
            });
        },

    };

});
