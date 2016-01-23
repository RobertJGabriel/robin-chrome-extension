(function (angular) {
    'use strict';
    var ref = new Firebase("https://projectbird.firebaseio.com");
    var authData = ref.getAuth();
    angular.module('ngViewExample', ['ngRoute']).config(['$routeProvider',
		'$locationProvider',
		function ($routeProvider, $locationProvider) {
            $routeProvider.when('/login/', {
                templateUrl: './assets/view/login.html',
                controller: 'login',
                controllerAs: 'login'
            }).when('/index.html', {
                templateUrl: './assets/view/login.html',
                controller: 'login',
                controllerAs: 'login'
            }).when('/profile/child/:childname', {
                templateUrl: './assets/view/profile.html',
                controller: 'child',
                controllerAs: 'child'
            }).when('/signup', {
                templateUrl: './assets/view/signup.html',
                controller: 'signup',
                controllerAs: 'signup'
            });
            $locationProvider.html5Mode(true);
		}
	]).controller('MainCtrl', function ($scope, $route, $routeParams, $location) {
        $scope.name = "ChapterController";
        $scope.params = $routeParams;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.logout = function () {
            ref.unauth();
            console.log('logged out');
        };
    }).controller('login', function ($scope, $route, $routeParams, $location) {
        $scope.name = "loginsss";
        $scope.params = $routeParams;
        $scope.showError = false;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.logout = function () {
            ref.unauth();
            console.log('logged out');
        };
    }).controller('child', function ($scope, $route, $routeParams, $location) {
        $scope.name = "loginsss";
        $scope.params = $routeParams;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.logout = function () {
            ref.unauth();
            console.log('logged out');
        };
    }).controller('signup', function ($scope, $route, $routeParams, $location) {
        $scope.name = "signup";
        $scope.params = $routeParams;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.logout = function () {
            ref.unauth();
            console.log('logged out');
        };
    }).controller("forms", function ($scope) {



        $scope.login = function () { // Saves options to chrome.storage
            ref.authWithPassword({
                email: $('input[name="email"]').val(),
                password: $('input[name="password"]').val()
            }, function (error, userObj) {
                error ? errorCodes(error) : displayMessage(userObj);
            });
        };

        function errorCodes(error) {
            console.log(error);
            switch (error.code) {
                case "EMAIL_TAKEN":
                    displayMessage("The new user account cannot be created use.");
                    break;
                case "INVALID_EMAIL":
                    displayMessage("The specified eeeeemail is not a valid email.");
                    break;
                default:
                    displayMessage("Error creating user:", error);
            }
        }

        function displayMessage(message) {
            setTimeout(function () {
                $scope.showError = true;
                $scope.errorMessage = message;
                $scope.$apply();
            }, 1000)
        }
        $scope.signup = function () {
            $scope.showError = null;
            ref.createUser({
                email: $('input[name="email"]').val(),
                password: $('input[name="password"]').val()
            }, function (error, userObj) {
                error ? errorCodes(error) : displayMessage2(userObj, $('input[name="email"]').val(), $('input[name="password"]').val());
            });
        };
    });

    function getName(authData) {
        switch (authData.provider) {
            case 'password':
                return authData.password.email.replace(/@.*/, '');
            case 'twitter':
                return authData.twitter.displayName;
            case 'facebook':
                return authData.facebook.displayName;
        }
    }

    function authDataCallback(authData) {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
        } else {
            console.log("User is logged out");
        }
    }

    ref.onAuth(authDataCallback);

    function authDataCallback(authData) {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
        } else {
            console.log("User is logged out");
        }
    }
    if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
    } else {
        console.log("User is logged out");
    }

    function displayMessage2(userData, email, password) {

        console.log("Successfully created user account with uid:", userData.uid);
        var usersRef = ref.child(userData.uid);
        usersRef.child('information').set({
            email: email,
            password: password
        });
    }
})(window.angular);
