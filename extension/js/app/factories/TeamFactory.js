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

        createTeam: function(teamInfo) {
            return $http(composeRequest('POST', '/api/team', teamInfo))
            .then(function (response){
                return response.data;
            });
        },

        deleteTeam: function(teamID) {
            return $http(composeRequest('DELETE', '/api/team/' + teamID))
            .then(function (response) {
              return response.data;
            });
        },

        getTeamMembers: function(teamID) {
            return $http(composeRequest('GET', '/api/team/' + teamID + '/users'))
            .then(function (response){
                return response.data;
            });
        },

        deleteTeamMember: function(teamID, userID){
            return $http(composeRequest('DELETE', '/api/team/' + teamID + '/users/' + userID))
            .then(function (response){
                return response.data;
            });
        },

        updateTeam: function(teamID, teamInfo) {
            return $http(composeRequest('PUT', '/api/team/' + teamID, teamInfo))
            .then(function (response){
                return response.data;
            });
        }
    };

});
