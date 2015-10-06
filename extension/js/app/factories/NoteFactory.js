app.factory('NoteFactory', function ($http) {

    var server = 'http://127.0.0.1:1337';

    var composeRequest = function (method, url, data) {
        return {
            method: method,
            url: server + url,
            data: data
        };
    };

    return {

        factorymethod: function() {

        },
    }

});
