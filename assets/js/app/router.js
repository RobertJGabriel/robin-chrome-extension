var app = angular.module('robinChrome', ['ngRoute']);
var ref = new Firebase("https://projectbird-robin.firebaseio.com");
ref.onAuth(authDataCallback);
var authData = ref.getAuth();



app.filter('unique', function() {
  return function(input, key) {
    var unique = {};
    var uniqueList = [];
    for (var i = 0; i < input.length; i++) {
      if (typeof unique[input[i][key]] == "undefined") {
        unique[input[i][key]] = "";
        uniqueList.push(input[i]);
      }
    }
    return uniqueList;
  };
});



app.config(['$routeProvider', '$locationProvider', '$compileProvider', function($routeProvider, $locationProvider, $compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|coui|chrome-extension):/);
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|assets|chrome-extension):|data:image\//);

  if (authData) {

    $routeProvider.when('/index.html', {
      templateUrl: './assets/view/home.html',
      controller: 'main',
      cache: false,
      resolve: {
        // I will cause a 1 second delay
        delay: function($q, $timeout) {
          var delay = $q.defer();
          $timeout(delay.resolve, 1000);
          return delay.promise;
        }
      }
    }).when('/logout', {
      templateUrl: './assets/view/logout.html',
      controller: 'logout',
      cache: false,
      resolve: {
        // I will cause a 1 second delay
        delay: function($q, $timeout) {
          var delay = $q.defer();
          $timeout(delay.resolve, 1000);
          return delay.promise;
        }
      }
    }).when('/blacklist', {
      templateUrl: './assets/view/blacklist.html',
      controller: 'main',
      cache: false,
      resolve: {
        // I will cause a 1 second delay
        delay: function($q, $timeout) {
          var delay = $q.defer();
          $timeout(delay.resolve, 1000);
          return delay.promise;
        }
      }
    }).when('/settings', {
      templateUrl: './assets/view/settings.html',
      controller: 'main',
      cache: false,
      resolve: {
        // I will cause a 1 second delay
        delay: function($q, $timeout) {
          var delay = $q.defer();
          $timeout(delay.resolve, 1000);
          return delay.promise;
        }
      }
    }).when('/help', {
      templateUrl: './assets/view/help.html',
      controller: 'help',
      cache: false,
      resolve: {
        // I will cause a 1 second delay
        delay: function($q, $timeout) {
          var delay = $q.defer();
          $timeout(delay.resolve, 1000);
          return delay.promise;
        }
      }
    }).when('/child/:id', {
      templateUrl: './assets/view/profile.html',
      controller: 'child',
      cache: false,
      resolve: {
        // I will cause a 1 second delay
        delay: function($q, $timeout) {
          var delay = $q.defer();
          $timeout(delay.resolve, 1000);
          return delay.promise;
        }
      }

    });
  } else {
    $routeProvider.when('/index.html', {
      controller: 'logg',
      cache: false,
      templateUrl: './assets/view/login.html',
      resolve: {
        // I will cause a 1 second delay
        delay: function($q, $timeout) {
          var delay = $q.defer();
          $timeout(delay.resolve, 1000);
          return delay.promise;
        }
      }
    }).when('/login', {
      controller: 'logg',
      cache: false,
      templateUrl: './assets/view/login.html',
      resolve: {
        // I will cause a 1 second delay
        delay: function($q, $timeout) {
          var delay = $q.defer();
          $timeout(delay.resolve, 1000);
          return delay.promise;
        }
      }
    }).when('/help', {
      templateUrl: './assets/view/help.html',
      controller: 'help',
      cache: false,
      resolve: {
        // I will cause a 1 second delay
        delay: function($q, $timeout) {
          var delay = $q.defer();
          $timeout(delay.resolve, 1000);
          return delay.promise;
        }
      }
    }).when('/signup', {
      templateUrl: './assets/view/signup.html',
      controller: 'logg',
      cache: false,
      resolve: {
        // I will cause a 1 second delay
        delay: function($q, $timeout) {
          var delay = $q.defer();
          $timeout(delay.resolve, 1000);
          return delay.promise;
        }
      }
    });
  }
  $locationProvider.html5Mode(true);
}]);



app.controller('main', function($scope, $route, $routeParams, $location) {

  $scope.name = "robin";
  $scope.params = $routeParams;
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.showError = false;
  $scope.loggedin = authData;
  $scope.children = [];
  $scope.lists = [];
  $scope.profanity = [];
  $scope.stopped = "yes";
  $scope.theme = (localStorage.getItem('theme') !== null) ? localStorage.getItem('theme') : "#F44336";
  $scope.themeStyle = (localStorage.getItem('theme') !== null) ? {
    'background-color': $scope.theme
  } : {
    'background-color': "#F44336"
  };

  try {
    ref.child(authData.uid).on("value", function(snapshot) {

      for (var f in snapshot.val()["children"]) {
        $scope.children.push({
          id: f,
          currentUrl: snapshot.val()["children"][f]["currentUrl"].replace(/['"]+/g, '').slice(26),
          time: snapshot.val()["children"][f]["time"],
          date: snapshot.val()["children"][f]["date"],
          name: snapshot.val()["children"][f]["name"],
          stop: snapshot.val()["children"][f]["stop"],
          platform: snapshot.val()["children"][f]["platform"]
        });

      }


      for (var q in snapshot.val()["list"]) {
        $scope.lists.push({
          url: q.replace(/['"]+/g, ''),
          type: snapshot.val()["list"][q]["type"]
        });
      }
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    $scope.getClass = function(path) {
      return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    }

    $scope.getAddress = function(path) {
        return ($location.path().substr(0, path.length) === path) ? 'true' : '';

      }
      /**
       * sets current color or theme
       * @param {String} color
       * @return {none} none
       */
    $scope.setColor = function(colors) {

      $scope.removeLocalStorage('theme');
      $scope.theme = colors;
      localStorage.setItem('theme', $scope.theme);
      $scope.themeStyle = {
        'background-color': colors
      };
    };




    /**
     * Remove localstorage by key
     * @param {String} Key
     * @return {none} none
     */
    $scope.removeLocalStorage = function(key) {
      localStorage.removeItem(key);
    };

    ref.child("profanity").on("value", function(snapshot) {
      for (var e in snapshot.val()) {
        $scope.profanity.push({
          word: snapshot.val()[e]["word"],
          type: snapshot.val()[e]["type"]
        });

      }
      console.log($scope.profanity);
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

  } catch (e) {
    // statements to handle any exceptions
    // pass exception object to error handler
  }

  /**
   * Stringify a string
   * @param {String} String
   * @return {String} JSON encoded string
   */
  function stringify(string) {

    return JSON.stringify(string);
  }


  /**
   * Sets black or white list site
   * @param {String} userData
   * @param {String} email
   * @param {String} password
   * @return {none} none
   */
  $scope.addBlackOrWhite = function() {
    $scope.showError = true;
    var temp = $('input[name="blackorwhiteInputs"]').val();
    var temp2 = $('select[name="typeee"]').val();
    $scope.errorMessage = "Added new Url" + temp + "with type  " + temp2;
    var usersRef = ref.child(authData.uid).child("list").child(stringify(temp));
    usersRef.set({
      type: removeRegex(temp2)
    });
  }


  /**
   * Sets black or white list site
   * @param {String} userData
   * @param {String} email
   * @param {String} password
   * @return {none} none
   */
  $scope.deleteBlackOrWhite = function(index, event) {
    $scope.showError = true;
    $scope.errorMessage = "Deleted " + index + event.target.id;
    $scope.lists.splice(index, 1);
    var usersRef = ref.child(authData.uid).child("list").child('"' + event.target.id + '"').remove();
  }


  /**
   * Stop Innet
   * @param {String} userData
   * @param {String} email
   * @param {String} password
   * @return {none} none
   */
  $scope.stopInternet = function(id, event) {

    console.log($scope.stopped);
    var usersRef = ref.child(authData.uid).child("children").child(event.target.id);
    usersRef.update({
      stop: "yes"
    });
    $scope.stopped = "no";
    $scope.$apply;
  }





  /**
   * Stop Innet
   * @param {String} userData
   * @param {String} email
   * @param {String} password
   * @return {none} none
   */
  $scope.startInternet = function(id, event) {

    console.log($scope.stopped);
    var usersRef = ref.child(authData.uid).child("children").child(event.target.id);
    usersRef.update({
      stop: "no"
    });
    $scope.stopped = "yes";
    $scope.$apply;
  }

});

app.controller('child', function($scope, $route, $routeParams, $location) {

  $scope.name = "robin";
  $scope.params = $routeParams;

  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.showError = false;
  $scope.loggedin = authData;
  $scope.child = [];

  ref.child(authData.uid).child("children").child($scope.params.id).on("value", function(snapshot) {


    $scope.child.push({
      id: $scope.params.id,
      currentUrl: snapshot.val()["currentUrl"].replace(/['"]+/g, '').slice(26),
      time: snapshot.val()["time"],
      date: snapshot.val()["date"],
      name: snapshot.val()["name"],
      stop: snapshot.val()["stop"],
      platform: snapshot.val()["platform"]
    });

    console.log($scope.child);
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

});






app.controller('logg', function($scope, $route, $routeParams, $location) {
  $scope.name = "robin";
  $scope.params = $routeParams;
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.showError = false;
  $scope.loggedin = false;



  /**
   * reset users password
   * @param {none} none
   * @return {none} none
   */
  $scope.resetPasswords = function() {

    ref.resetPassword({
      email: $('input[name="inputemail"]').val()
    }, function(error) {
      if (error) {
        switch (error.code) {
          case "INVALID_USER":
            $scope.errorMessage = "no users";
            break;
          default:
            $scope.errorMessage = "Error resetting password:" + error;
        }
      } else {
        $scope.errorMessage = "Password reset email sent successfully!";
      }
    });
  };
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
      error ? errorCodes(error) : displayMessage("Just logging you in"), loginInformation($('input[name="loginemail"]').val(), authData);
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
      error ? errorCodes(error) : createData(userObj, $('input[name="signupemail"]').val(), $('input[name="signuppassword"]').val()), displayMessage("Awesome , Your account is created"), redirect('/index.html');
    });
  };


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

});



app.controller('logout', function($scope, $route, $routeParams, $location) {
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




app.controller('home', function($scope, $route, $routeParams, $location) {

  $scope.name = "home";
  $scope.params = $routeParams;
  $scope.showError = false;
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.loggedin = false;







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
    ip: {},
    list: {}
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
  var desired = stringToReplace.replace(/[^\w\s]/gi, '');
  desired = desired.replace(/[^a-zA-Z ]/g, "");
  return desired;
}




/**
 * removeRegex for Mac
 * @param {string} stringToReplace
 * @return {string} desired
 */
function removeRegexForMac(stringToReplace) {
  var desired = stringToReplace.replace(/[^\w\s]/gi, '');
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
      response === "true" ? profanityToFirebase(words[i]) : null;
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
    async: true,
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
  ref.child("users").startAt(email).endAt(email).once('value', function(snapshot) {
    console.log(snapshot.val());
    redirect("/index.html");
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

/**
 * Get profanity words
 * @param {none} none
 * @param {none} none
 * @return {object} snapshot
 */
function getProfanityWords(temp, callback) {
  ref.child("profanity").on('value', function(snapshot) {
    console.log(snapshot.val());
    callback(snapshot.val());
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}


/**
 * Get the current IP address of the user.
 * @param {none} none
 * @return {none} none
 */
function getIp(test) {
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
    console.log("User " + authData.uid + " is logged in with " +
      authData.provider);
  } else {
    console.log("User is logged out");
  }
}



$('body').on('click', '.search', function() {
  chrome.tabs.create({
    url: $(this).attr('href')
  });
  return false;
});
