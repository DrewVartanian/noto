app.factory('NoteFactory', function ($http,BackgroundFactory) {

    var backgroundPage = BackgroundFactory.getBackgroundPage();
    var currentUser = backgroundPage.user;
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
        // notes written by current user
        getMyNotes: function() {
            return $http(composeRequest('GET', '/api/note/user'))
            .then(function (response){
                return response.data;
            });
        },

        getNote: function(noteID) {
            return $http(composeRequest('GET', '/api/note/' + noteID))
            .then(function (response){
                return response.data;
            });
        },

        createNote: function(noteInfo) {
            return $http(composeRequest('POST', '/api/note', noteInfo))
            .then(function (response){
                return response.data;
            });
        },

        updateNote: function(noteID, noteInfo) {
            return $http(composeRequest('PUT', '/api/note/' + noteID, noteInfo))
            .then(function (response){
                return response.data;
            });
        },

        deleteNote: function(noteID) {
            return $http(composeRequest('DELETE', '/api/note/' + noteID))
            .then(function (response) {
              return response.data;
            });
        }

    };

});
