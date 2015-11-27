ljs.load(['assets/js/lib/firebase_core.js', 'assets/js/lib/jquery.js'], 'assets/js/lib/jquery.serialize-object.compiled.js', 'assets/js/lib/path.min.js', 'assets/js/lib/bootstrap.js', 'assets/js/lib/responisve.js', 'assets/js/lib/firebase.js', 'assets/js/lib/ripples.min.js', 'assets/js/lib/material.js', function () {

    // This command is used to initialize some elements and make them work properly
    $.material.init();





});



function regexUrlextensioncheck(n) {

    var s = document.URL,
        e = new RegExp(n);


    return e.test(s);
}
