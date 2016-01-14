(function (angular) {
    'use strict';
    angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
        .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
                $routeProvider
                    .when('/login/', {
                        templateUrl: './assets/view/login.html',
                        controller: 'login',
                        controllerAs: 'login'
                    })
                    .when('/', {
                        templateUrl: './assets/view/login.html',
                        controller: 'login',
                        controllerAs: 'login'
                    })
                    .when('/signup', {
                        templateUrl: './assets/view/signup.html',
                        controller: 'signup',
                        controllerAs: 'signup'
                    })

                .when('/logout', {
                    templateUrl: './assets/view/logout.html',
                    controller: 'logout',
                    controllerAs: 'logout'
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
            this.name = "login";
            this.params = $routeParams;
  }])
        .controller('logout', ['$routeParams', function ($routeParams) {
            this.name = "logout";
            this.params = $routeParams;
  }])

    .controller('signup', ['$routeParams', function ($routeParams) {
        this.name = "signup";
        this.params = $routeParams;
  }]);
})(window.angular);
