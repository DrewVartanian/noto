app.factory('TeamFactory', function ($http, BackgroundFactory, RequestFactory) {

    return {

        getMyTeams: function() {
            return BackgroundFactory.getBackgroundPage().teamsProm;
        },

        createTeam: function(teamInfo) {
            return $http(RequestFactory.composeRequest('POST', '/api/team', teamInfo))
            .then(function (response){
                return response.data;
            });
        },

        deleteTeam: function(teamID) {
            return $http(RequestFactory.composeRequest('DELETE', '/api/team/' + teamID))
            .then(function (response) {
              return response.data;
            });
        },

        // getTeamMembers: function(teamID) {
        //     return $http(RequestFactory.composeRequest('GET', '/api/team/' + teamID + '/users'))
        //     .then(function (response){
        //         return response.data;
        //     });
        // },

        deleteTeamMember: function(teamID, userID){
            return $http(RequestFactory.composeRequest('DELETE', '/api/team/' + teamID + '/users/' + userID))
            .then(function (response){
                console.log("resdata", response.data);
                return response.data;
            });
        },

        updateTeam: function(teamID, teamInfo) {
            return $http(RequestFactory.composeRequest('PUT', '/api/team/' + teamID, teamInfo))
            .then(function (response){
                return response.data;
            });
        },

        createNewTeam: function(teamName) {
            return $http(RequestFactory.composeRequest('POST', '/api/team/', {teamName: teamName}))
            .then(function (response){
                return response.data;
            });
        },

        getTeamMembers: function() {
            return $http(RequestFactory.composeRequest('GET', '/api/team/users'))
            .then(function (response){
                return response.data;
            });
        }
    };

});
