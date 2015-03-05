define(['angular', 'angular-resource', 'angular-animate', 'ngDialog', 'angular-ui-router','services','checklist'],function(){
    var myAdmin = angular.module('admin', ['ui.router', 'ngResource', 'ngAnimate', 'myService', 'ngDialog', 'checklist-model']);
    myAdmin.run(["$window", '$rootScope', '$state', "Auth", function($window, $rootScope, $state, Auth) {
        if ($window.sessionStorage["token"]) {
            Auth.setToken($window.sessionStorage["token"]);
        } else {
            Auth.setToken(null);
        }
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            // console.log(event);

        });
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            console.log(error)
            if (error.authenticated === false) {
                $state.go("login");
            }
            if (error.logined === true) {
                $state.go("admin");
            }
        });
    }])
    return myAdmin;
})