app.factory('PageFactory', function ($http, BackgroundFactory) {

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
            return BackgroundFactory.getBackgroundPage().pagesProm;
        }
    };

});
