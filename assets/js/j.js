$(document).ready(function () {

    // the main firebase reference
    var ref = new Firebase("https://projectbird.firebaseio.com");

    var authData = ref.getAuth();

    // Form submission for registering
    $("#signup").submit(function (event) {
        var userAndPass = $(this).serializeObject();
        createUser(userAndPass);

        event.preventDefault();
    });

    $("#login").submit(function (event) {
        // Or with an email/password combination
        ref.authWithPassword({
            email: $('input[name="email"]').val(),
            password: $('input[name="password"]').val()
        }, authHandler);
        event.preventDefault();
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
    function createUser(userObj) {
        var deferred = $.Deferred();
        ref.createUser(userObj, function (error, userObj) {
            error ? errorCodes(error) : displayMessage(userObj);
        });

        return deferred.promise();
    }




    function errorCodes(error) {
        switch (error.code) {
            case "EMAIL_TAKEN":
                console.log("The new user account cannot be created because the email is already in use.");
                break;
            case "INVALID_EMAIL":
                console.log("The specified email is not a valid email.");
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


});
