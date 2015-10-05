app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/app/states/signup/signup.html',
        controller: 'signupCtrl'
    });

});

app.controller('signupCtrl', function ($scope, BackgroundFactory, $state) {

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
    $scope.signup = {};
    $scope.error = null;

    $scope.sendSignup = function (signupInfo) {
        if(signupInfo.password !== signupInfo.emailvalid) {
            return $scope.error = "Paswords do not match!";
        }
        if(!validateEmail(signupInfo.email)) {
            return $scope.error = "Please enter a valid email addresss";
        }
        $scope.error = null;

        BackgroundFactory.registerUser(signupInfo).then(BackgroundFactory.logInUser(signupInfo)).then(function () {
            $state.go('webnote');
        }).catch(function () {
            $scope.error = 'Invalid signup credentials.';
        });

    };  

});

