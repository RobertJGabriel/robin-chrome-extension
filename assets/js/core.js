(function(angular) {
    'use strict';
    var ref = new Firebase("https://projectbird.firebaseio.com");
    var authData = ref.getAuth();
    var listOfVerbs = ["anal", "ran", "love"];
    var ip = null;
    getIp(function(response) {
        console.log(response);
        ip = response;
    });
    angular.module('robinChrome', ['ngRoute']).config(['$routeProvider',
        '$locationProvider',
        function($routeProvider, $locationProvider) {
            if (authData) {
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
            }
            $locationProvider.html5Mode(true);
        }
    ]).controller('main', function($scope, $route, $routeParams, $location) {
        $scope.name = "robin";
        $scope.params = $routeParams;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.showError = false;
        $scope.loggedin = authData;

        /**
        * Hand the login information for the robin
        * @param {none} none 
        * @param {none} none
        * @return {none} none
        */
        $scope.login = function() {
            $scope.showError = null;
            ref.child("users").authWithPassword({
                email: $('input[name="loginemail"]').val(),
                password: $('input[name="loginpassword"]').val()
            }, function(error, authData) {
                error ? errorCodes(error) : displayMessage("Just logging you in"),loginInformation($('input[name="loginemail"]').val(), authData);
            });
        };


        /**
        * Hand the signup information for the robin
        * @param {none} none 
        * @param {none} none
        * @return {none} none
        */
        $scope.signup = function() {
            $scope.showError = null;
            ref.child("users").createUser({
                email: $('input[name="signupemail"]').val(),
                password: $('input[name="signuppassword"]').val()
            }, function(error, userObj) {
                error ? errorCodes(error) : displayMessage( "Awesome , Your account is created"), createData(userObj, $('input[name="signupemail"]').val(), $('input[name="signuppassword"]').val());
            });
        };


        /**
        * Display and error or comfirm message on login
        * @param {String} message
        * @return {none} none
        */
        function displayMessage(message) {
            setTimeout(function() {
                $scope.showError = true;
                $scope.errorMessage = message;
                $scope.$apply();
            }, 1000)
        }

    }).controller('logout', function($scope, $route, $routeParams, $location) {
        $scope.name = "logout";
        $scope.params = $routeParams;
        $scope.showError = false;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.loggedin = false;
        ref.unauth();
        redirect("/index.html");
    });


    /**
    * Creates the user and stores it in the database
    * @param {String} userData
    * @param {String} email
    * @param {String} password
    * @return {none} none
    */
    function createData(userData, email, password) {
        var usersRef = ref.child(userData.uid);
        usersRef.set({
            information: {
                email: email,
                password: password
            },
            ip: {}
        });
        setIpAddress(userData.uid);
    }


    /**
    * Set the current userId in the database.
    * @param {String} id 
    * @return {none} none
    */
    function setIpAddress(id) {
        var usersRef = ref.child(id).child("ip").child(removeRegex(ip));
        usersRef.set({
            status: "active",
            currentUrl: "none"
        });
    }


    /**
    * Attach an asynchronous callback to read the data at our posts reference
    * @param {none} none
    * @param {none} none
    * @return {none} none
    */
    try {
        ref.child(authData.uid).on("value", function(snapshot) {
            console.log(snapshot.val());
        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    } catch (e) {
        // statements to handle any exceptions
    }


    /**
    * removeRegex
    * @param {string} stringToReplace
    * @return {string} desired
    */
    function removeRegex(stringToReplace) {
        var desired = stringToReplace.replace(/[^\w\s]/gi, '')
        return desired;
    }


    /**
    * Checks each word if they profanity in an array.
    * @param {string} url
    * @param {object} words
    * @return {none} none
    */
    function addWord(url, words) {
        for (var i = 0; i < words.length - 1; i++) {
            profanityCheck(words[i], function(response) {
                response === "true" ? wordToFirebase(words[i]) : null;
            });
        }
    }


    /**
    * redirect, rediect the user
    * @param {string} url
    * @return {none} none
    */
    function redirect(url) {
        setTimeout(function() {
            window.location = url;
        }, 1000);
    }


    /**
    * Checks for profanity
    * @param {object} callback 
    * @param {String} word
    * @return {profanity} returns true or false if the word is classed.
    */
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


    /**
    * Sets the ipaddress and gets the user information objects,
    * @param {string} the users email address they inputted
    * @param {number} The firebase Id for the user.
    * @return {none} none
    */
    function loginInformation(email, id) {
        ref.child("users").startAt(email).endAt(email).once('value', function(
            snapshot) {
            console.log(snapshot.val());
            setIpAddress(id);
            redirect("/index.html");
        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }

    /**
    * Get the current IP address of the user.
    * @param {none} none
    * @return {none} none
    */
    function getIp() {
        $.ajax({
            url: "http://jsonip.com/",
            async: false,
            type: "GET",
            dataType: "json",
            success: function(data) {
                ip = data.ip;
                return data.ip;
            }
        });
    }


    /**
    * Handles and Displays the error codes
    * @param {object} The error object thats is sent in from  firebase
    * @return {none} none
    */
    function errorCodes(error) {
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


    /**
    * Store words that are classed as profanity to the database
    * @param {word} the stting needed to be stored
    * @return {none} none
    */
    function profanityToFirebase(word) {
        var usersRef = ref.child("profanity").child(word);
        usersRef.update({
            profanity: "true"
        });
    }


    /**
    * Check if the user is logged in or not
    * @param  {none} none
    * @param  {none} none
    * @return {none} none
    */
    function authDataCallback(authData) {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
        } else {
            console.log("User is logged out");
        }
    }
    ref.onAuth(authDataCallback);
})(window.angular);