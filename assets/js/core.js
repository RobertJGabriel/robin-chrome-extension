(function(angular) {
    'use strict';
    var ref = new Firebase("https://projectbird.firebaseio.com");
    var authData = ref.getAuth();
    angular.module('ngViewExample', ['ngRoute']).config(['$routeProvider',
        '$locationProvider',
        function($routeProvider, $locationProvider) {

            if (authData) {
               // console.log("User " + authData.uid + " is logged in with " + authData.provider);
                $routeProvider.when('/index.html', {
                    templateUrl: './assets/view/home.html',
                    controller: 'login',
                    controllerAs: 'login'
                }).when('/logout', {
                    templateUrl: './assets/view/logout.html',
                    controller: 'logout',
                    controllerAs: 'logout'
                }).when('/profile/child/:childname', {
                    templateUrl: './assets/view/profile.html',
                    controller: 'child',
                    controllerAs: 'child'
                });
            } else {
                 $routeProvider.when('/login/', {
                    templateUrl: './assets/view/login.html',
                    controller: 'login',
                    controllerAs: 'login'
                }).when('/index.html', {
                    templateUrl: './assets/view/login.html',
                    controller: 'login',
                    controllerAs: 'login'
                }).when('/signup', {
                    templateUrl: './assets/view/signup.html',
                    controller: 'signup',
                    controllerAs: 'signup'
                });
                console.log("User is logged out");
            }

        
            $locationProvider.html5Mode(true);
        }
    ]).controller('MainCtrl', function($scope, $route, $routeParams, $location) {
        $scope.name = "ChapterController";
        $scope.params = $routeParams;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;


    
    }).controller('login', function($scope, $route, $routeParams, $location) {
        $scope.name = "loginsss";
        $scope.params = $routeParams;
        $scope.showError = false;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.loggedin = false;

       
    }).controller('logout', function($scope, $route, $routeParams, $location) {
        $scope.name = "logout";
        $scope.params = $routeParams;
        $scope.showError = false;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.loggedin = false;

        ref.unauth();
        console.log('logged out');
    }).controller('child', function($scope, $route, $routeParams, $location) {
        $scope.name = "loginsss";
        $scope.params = $routeParams;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.loggedin = true;

    }).controller('signup', function($scope, $route, $routeParams, $location) {
        $scope.name = "signup";
        $scope.params = $routeParams;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.loggedin = false;

    }).controller("forms", function($scope) {
        $scope.login = function() { // Saves options to chrome.storage
            ref.authWithPassword({
                email: $('input[name="loginemail"]').val(),
                password: $('input[name="loginpassword"]').val()
            }, function(error, authData) {
                console.log(authData);
                error ? errorCodes(error) : displayMessage("Just logging you in"),
                    loginInformation($('input[name="loginemail"]').val(), authData);
            });
        };

        function loginInformation(email, id) {
            ref.startAt(email).endAt(email).once('value', function(snapshot) {
                console.log(snapshot.val());
            }, function(errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
        }

        function errorCodes(error) {
            console.log(error.code);
            switch (error.code) {
                case "EMAIL_TAKEN":
                    displayMessage("The new user account cannot be created use.");
                    break;
                case "INVALID_EMAIL":
                    displayMessage("The specified eeeeemail is not a valid email.");
                    break;
                case "INVALID_USER":
                    displayMessage("The email or password wasnt there ");
                    break;
                case "INVALID_PASSWORD":
                    displayMessage("The email or password wasnt there ");
                    break;
                default:
                    displayMessage("Error :", error);
            }
        }

        function displayMessage(message) {
            setTimeout(function() {
                $scope.showError = true;
                $scope.errorMessage = message;
                $scope.$apply();
            }, 1000)
        }
        $scope.signup = function() {
            $scope.showError = null;
            ref.createUser({
                email: $('input[name="signupemail"]').val(),
                password: $('input[name="signuppassword"]').val()
            }, function(error, userObj) {
                error ? errorCodes(error) : displayMessage(
                    "Awesome , Your account is created"), createData(userObj, $(
                    'input[name="signupemail"]').val(), $(
                    'input[name="signuppassword"]').val());
            });
        };
    });

    function createData(userData, email, password) {
        var usersRef = ref.child(userData.uid);
        usersRef.child('information').set({
            email: email,
            password: password
        });
    }

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

})(window.angular);