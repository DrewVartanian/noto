app.factory('ExtensionFactory', function ($http){
	
	var server = 'http://127.0.0.1:1337';


	return {
		getPages: function() {
			return $http.get(server+'/api/user/page')
			.then(function (res){
				return res.data;
			});
		};
	}
});