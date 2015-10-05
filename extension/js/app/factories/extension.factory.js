app.factory('ExtensionFactory', function ($http){
	
	var getPages = function(user) {
		return $http.get('http://127.0.0.1:1337/api/members/' + user._id)
		.then(function (res){
			return res.data;
		});
	};

	return {
		getPages: getPages
	}
});