(function(angular) {
    'use strict';
    var ref = new Firebase("https://projectbird.firebaseio.com");
    var authData = ref.getAuth();
    var listOfVerbs = ["anal", "ran", "love"];


    angular.module('robinChrome', ['ngRoute']).config(['$routeProvider','$locationProvider',
        function($routeProvider, $locationProvider) {
            if (authData) {
                console.log("User " + authData.uid + " is logged in with " + authData.provider);
                $routeProvider.when('/index.html', {
                    templateUrl: './assets/view/home.html',
                    controller: 'main',
                    controllerAs: 'main'
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
                    controller: 'main',
                    controllerAs: 'main'
                }).when('/signup', {
                    templateUrl: './assets/view/signup.html',
                    controller: 'main',
                    controllerAs: 'main'
                });
                console.log("User is logged out");
            }
            $locationProvider.html5Mode(true);
        }
    ]).controller('main', function($scope, $route, $routeParams,$location) {
        $scope.name = "robin";
        $scope.params = $routeParams;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.showError = false;
        $scope.loggedin = authData;

    //    addWord("http://www.google.com", listOfVerbs);
        $scope.login = function() { // Saves options to chrome.storage
            ref.child("users").authWithPassword({
                email: $('input[name="loginemail"]').val(),
                password: $('input[name="loginpassword"]').val()
            }, function(error, authData) {
                console.log(authData);
                error ? errorCodes(error) :displayMessage("Just logging you in"),loginInformation($('input[name="loginemail"]').val(), authData);
            });
        };

        function loginInformation(email, id) {

    
            ref.child("users").startAt(id.uid).endAt(id.uid).once('value', function(snapshot) {
                    console.log(snapshot.val());
                    redirect("/index.html");
                }, function(errorObject) {
                    console.log("The read failed: " +errorObject.code);
                });
        }

        function errorCodes(error) {
            console.log(error.code);
            switch (error.code) {
                case "EMAIL_TAKEN":
                    displayMessage(
                        "The new user account cannot be created use."
                    );
                    break;
                case "INVALID_EMAIL":
                    displayMessage(
                        "The specified eeeeemail is not a valid email."
                    );
                    break;
                case "INVALID_USER":
                    displayMessage(
                        "The email or password wasnt there "
                    );
                    break;
                case "INVALID_PASSWORD":
                    displayMessage(
                        "The email or password wasnt there "
                    );
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
            ref.child("users").createUser({
                email: $('input[name="signupemail"]').val(),
                password: $(
                        'input[name="signuppassword"]')
                    .val()
            }, function(error, userObj) {

                error ? errorCodes(error) :
                    displayMessage(
                        "Awesome , Your account is created"
                    ), createData(userObj, $(
                        'input[name="signupemail"]'
                    ).val(), $(
                        'input[name="signuppassword"]'
                    ).val());
            });
        };
    }).controller('logout', function($scope, $route, $routeParams,
        $location) {
        $scope.name = "logout";
        $scope.params = $routeParams;
        $scope.showError = false;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.loggedin = false;
        ref.unauth();
        redirect("/index.html");
    }).controller('child', function($scope, $route, $routeParams,
        $location) {
        $scope.name = "loginsss";
        $scope.params = $routeParams;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.loggedin = true;
    });

    function createData(userData, email, password) {
        var usersRef = ref.child(userData.uid);
        usersRef.set({
            information:{
                email: email,
                password: password
            },
            ip:{
                ip1: "s"
            }
        });
    }

          try {

    // Attach an asynchronous callback to read the data at our posts reference
    ref.child(authData.uid).on("value", function(snapshot) {
      console.log(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  
}
catch (e) {
   // statements to handle any exceptions
 
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

    function removeRegex(stringToReplace) {
        var desired = stringToReplace.replace(/[^\w\s]/gi, '')
        return desired;
    }

    function addWord(url, words) {
        for (var i = 0; i < words.length - 1; i++) {
            profanityCheck(words[i], function(response) {
                response === "true" ? wordToFirebase(words[i]) :null;
            });
        }
    }


    function redirect(url){

        setTimeout(function () {
            window.location = url;
        }, 5000);

    }

    function profanityCheck(word, callback) {
        $.ajax({
            url: "http://www.wdyl.com/profanity?q=" + word,
            async: false,
            type: "GET",
            dataType: "json",
            success: function(data) {
                callback(data.response);
            },
            error: function(e) {
                alert('error, try again');
            }
        });
    }

    function getIp(b) {
        $.ajax({
            url: "http://jsonip.com/",
            async: false,
            type: "GET",
            dataType: "json",
            success: function(data) {
                console.log(data.ip);
                return data.ip;
            }
        });
    }

    function wordToFirebase(word) {
        var usersRef = ref.child("profanity").child(word);
        usersRef.update({
            profanity: "true"
        });
    }

    function authDataCallback(authData) {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " +
                authData.provider);
        } else {
            console.log("User is logged out");
        }
    }
    ref.onAuth(authDataCallback);
})(window.angular);