define(['angular','angular-resource'], function(angular) {
    var myService = angular.module('myService', ['ngResource']);
    myService.
    factory('getList', ['$http', function($http) {
        return function(listType, page, per_page) {
            return $http.get("/api/" + listType + "/list/" + page + "/" + per_page)
        };
    }]).
    factory('Article', ['$resource', 'Auth', function($resource, Auth) {
        return $resource("/api/article/:id", {
            id: '@id'
        }, {
            'update': {
                method: 'PUT',
                headers: {
                    'Auth': Auth.getToken()
                }
            },
            'get': {
                method: 'GET'
            },
            'delete': {
                method: "DELETE",
                headers: {
                    'Auth': Auth.getToken()
                }
            }
        })
    }]).
    factory('Articles', ['$resource', 'Auth', function($resource, Auth) {
        return $resource("/api/articles", {}, {
            'save': {
                method: 'POST',
                headers: {
                    'Auth': Auth.getToken()
                }
            }
        })
    }]).
    factory('Category', ['$resource', 'Auth', function($resource, Auth) {
        return $resource("/api/category/:id", {
            id: '@id'
        }, {
            'update': {
                method: 'PUT',
                headers: {
                    'Auth': Auth.getToken()
                }
            },
            'get': {
                method: 'GET'
            },
            'delete': {
                method: "DELETE",
                headers: {
                    'Auth': Auth.getToken()
                }
            }
        })
    }]).
    factory('Categorys', ['$resource', 'Auth', function($resource, Auth) {
        return $resource("/api/categorys", {}, {
            'save': {
                method: 'POST',
                headers: {
                    'Auth': Auth.getToken()
                }
            }
        })
    }]).
    factory('Tag', ['$resource', 'Auth', function($resource, Auth) {
        return $resource("/api/tag/:id", {
            id: '@id'
        }, {
            'update': {
                method: 'PUT',
                headers: {
                    'Auth': Auth.getToken()
                }
            },
            'get': {
                method: 'GET'
            },
            'delete': {
                method: "DELETE",
                headers: {
                    'Auth': Auth.getToken()
                }
            }
        })
    }]).
    factory('Tags', ['$resource', 'Auth', function($resource, Auth) {
        return $resource("/api/tags", {}, {
            'save': {
                method: 'POST',
                headers: {
                    'Auth': Auth.getToken()
                }
            }
        })
    }]).
    factory('Users', ['$resource', function($resource) {
        return $resource("/api/users")
    }]).
    service('Auth', ['$http', function($http) {
        this.authToken = {};
        this.getToken = function() {
            return this.authToken["token"];
        }
        this.setToken = function(value) {
            this.authToken["token"] = value;
        }
        this.removeToken = function(value) {
            this.authToken["token"] = '';
        }

    }])
})