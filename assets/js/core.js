(function (angular) {
    'use strict';

    var ref = new Firebase("https://projectbird.firebaseio.com");
    var authData = ref.getAuth();

    angular.module('ngViewExample', ['ngRoute'])
        .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
                $routeProvider
                    .when('/login/', {
                        templateUrl: './assets/view/login.html',
                        controller: 'login',
                        controllerAs: 'login'
                    })
                    .when('/index.html', {
                        templateUrl: './assets/view/login.html',
                        controller: 'login',
                        controllerAs: 'login'
                    })

                .when('/signup', {
                    templateUrl: './assets/view/signup.html',
                    controller: 'signup',
                    controllerAs: 'signup'
                });

                $locationProvider.html5Mode(true);
  }])
        .controller('MainCtrl', ['$route', '$routeParams', '$location',
    function ($route, $routeParams, $location) {
                this.$route = $route;
                this.$location = $location;
                this.$routeParams = $routeParams;
  }])
        .controller('login', ['$routeParams', function ($routeParams) {
            this.name = "logsssin";
            this.params ="l";
            $scope.prop1 = "First";
  }])
        .controller('signup', ['$routeParams', function ($routeParams) {
            this.name = "signup";
            this.params = $routeParams;
  }])
        .controller("forms", function ($scope) {

            $scope.login = function () { // Saves options to chrome.storage
                ref.authWithPassword({
                    email: $('input[name="email"]').val(),
                    password: $('input[name="password"]').val()
                }, authHandler);
            };


            $scope.signup = function () {
                var userAndPass = $(this).serializeObject();
                alert(userAndPass);
                createUser(userAndPass);
            };
        })

    .controller('ChapterCtrl', ['$routeParams', function ($routeParams) {
        this.name = "ChapterCtrl";
        this.params = $routeParams;
  }]);



    function errorModal() {
        var modalInstance = $modal.open({
            templateUrl: '../view/error.html',
            controller: 'ModalInstanceCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return $scope.item;
                }
            }
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



    // Create a callback to handle the result of the authentication
    function authHandler(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
        }
    }



    // create a user but not login
    // returns a promsie
    function createUser(email, password) {
        var deferred = $.Deferred();
        ref.createUser({
            email: $('input[name="email"]').val(),
            password: $('input[name="password"]').val()
        }, function (error, userObj) {
            error ? errorCodes(error) : displayMessage(userObj);
        });

        return deferred.promise();
    }




    function errorCodes(error) {
        switch (error.code) {
            case "EMAIL_TAKEN":
                console.log("The new user account cannot be created because the email is already in use.");
                errorModal();
                break;
            case "INVALID_EMAIL":
                console.log("The specified email is not a valid email.");
                errorModal();
                break;
            default:
                console.log("Error creating user:", error);
        }
    }

    function displayMessage(userData) {
        console.log("Successfully created user account with uid:", userData.uid);
        var usersRef = ref.child(userData.uid);
        usersRef.child('information').set({
            provider: "userData.provider",
            name: "getName(userData)"
        });
    }






})(window.angular);
