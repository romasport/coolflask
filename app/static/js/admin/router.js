define(['app','angular-ui-router'],function(app){
    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider.
            state('admin', {
                    url: '/',
                    templateUrl: '/static/partials/admin/admin.html',
                    controller: 'dashCtr',
                    resolve: {
                        auth: ['$q', '$http', 'Auth', function($q, $http, Auth) {
                            var deferred = $q.defer();
                            var token = Auth.getToken();
                            token = !token ? "none" : token;
                            $http.post("/api/user/token", {
                                'token': token
                            }).then(function(result) {
                                if (result.data) {
                                    deferred.resolve(token);
                                } else {
                                    deferred.reject({
                                        authenticated: false
                                    });
                                }
                            }, function(error) {
                                console.log(error);
                            })
                            return deferred.promise;
                        }]
                    }
                }).state('admin.articleModify', {
                    url: 'article/modify/{id:[0-9]+}',
                    templateUrl: '/static/partials/admin/articleAction.html',
                    controller: 'articleActionCtr'
                }).state('admin.articleList', {
                    url: 'article/list',
                    templateUrl: '/static/partials/admin/articleList.html',
                    controller: 'articleListCtr'
                }).state('admin.articleCreate', {
                    url: 'article/create',
                    templateUrl: '/static/partials/admin/articleAction.html',
                    controller: 'articleActionCtr'
                }).state('login', {
                    url: '/login',
                    templateUrl: '/static/partials/admin/login.html',
                    controller: 'login',
                    resolve:{
                        isLogin:['$q', 'Auth',function($q,Auth){
                            var deferred = $q.defer();
                            if(Auth.getToken()){
                                deferred.reject({logined:true});
                            } else {
                                deferred.resolve("no login");
                            }
                            return deferred.promise;
                        }]
                    }
                })
                // $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise('/');
        }
    ])

})
