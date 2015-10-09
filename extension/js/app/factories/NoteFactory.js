app.factory('NoteFactory', function ($http,BackgroundFactory, RequestFactory) {

    var backgroundPage = BackgroundFactory.getBackgroundPage();
    var currentUser = backgroundPage.user;

    return {
        // note: this route uses req.user. re-wire to currentUser?
        // notes written by current user
        getMyNotes: function() {
            return $http(RequestFactory.composeRequest('GET', '/api/note/user'))
            .then(function (response){
                return response.data;
            });
        },

        getNote: function(noteID) {
            return $http(RequestFactory.composeRequest('GET', '/api/note/' + noteID))
            .then(function (response){
                return response.data;
            });
        },

        createNote: function(noteInfo) {
            return $http(RequestFactory.composeRequest('POST', '/api/note', noteInfo))
            .then(function (response){
                return response.data;
            });
        },

        updateNote: function(noteID, noteInfo) {
            return $http(RequestFactory.composeRequest('PUT', '/api/note/' + noteID, noteInfo))
            .then(function (response){
                return response.data;
            });
        },

        deleteNote: function(noteID) {
            return $http(RequestFactory.composeRequest('DELETE', '/api/note/' + noteID))
            .then(function (response) {
              return response.data;
            });
        }

    };

});
