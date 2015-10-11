// this is a shell. no UserFactory methods yet
app.factory('UserFactory', function ($http, RequestFactory) {

    return {
        getPages: function() {
            return $http(RequestFactory.composeRequest('GET', '/api/user/page'))
                .then(function(res) {
                    return res.data;
                });
        },
        getTeams: function() {
            return $http(RequestFactory.composeRequest('GET', '/api/user/team'))
                .then(function(res) {
                    return res.data;
                });
        },
        getAllUsers: function() {
            return $http(composeRequest('GET', '/api/user/allUsers'));
        }

    };
});