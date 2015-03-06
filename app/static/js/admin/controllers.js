define(['app','services','ngDialog','angular-ui-router'],function(app){
    app.
    controller('articleListCtr', ['$scope', 'getList', function($scope, getList) {
        getList('article', 1, 10).success(function(data) {
            $scope.dataList = data;
        })
    }]).
    controller('categoryListCtr', ['$scope', 'getList', function($scope, getList) {
        getList('category', 1, 10).success(function(data) {
            $scope.dataList = data;
        })
    }]).
    controller('dashCtr', ['$scope', '$window','$http','ngDialog', 'Auth',function($scope, $window,$http,ngDialog,Auth) {
        $scope.logout = function() {
            ngDialog.openConfirm({ //popup dialog to confire some action
                template: 'logout',
                className: 'ngdialog-theme-default'
            }).then(function(value) { // do action
                $window.sessionStorage['token']="";
                Auth.removeToken();
                setTimeout(function(){
                    $window.location.href="/";
                },1000);
            }, function(reason) { // cancle action
                console.log(reason);
            });
        }
    }]).
    controller('articleActionCtr', ['$scope', '$location', 'Articles', 'Article', '$stateParams', 'Categorys', 'Category','ngDialog', function($scope, $location, Articles, Article, $stateParams, Categorys, Category, ngDialog) {
        var id = $stateParams.id;
        $scope.formData = {};

        $scope.articleCategory = {};
        Categorys.query(function(d) {
            $scope.categoryList = d;
        });
        $scope.createCategory = "";
        $scope.articleCategory.data = [];

        function resetData(ob) {
            for (var i in ob) {
                if (typeof(ob[i]) == 'string') {
                    ob[i] = "";
                    continue;
                }
                if (ob[i] instanceof Array) {
                    ob[i] = [];
                    continue;
                }
                if (typeof(ob[i]) == "object") {
                    ob[i] = {};
                }
            }
        }

        function notify(info) {
            ngDialog.open({
                template: 'notify',
                data: {
                    action: info
                }
            })
        }

        $scope.cat = {};

        $scope.categoryAdd = function() {

            var category = new Categorys();
            category.name = $scope.cat.name;
            category.description = $scope.cat.description;
            category.$save(function() {
                Category.get({
                    id: $scope.cat.name
                }, function(d) {
                    $scope.categoryList.push({
                            'id': d.id,
                            'name': d.name
                        });
                    resetData($scope.cat);
                    $scope.category.$setPristine();
                })
            })
        };



        if (id) {
            /*modify post*/
            $scope.action = "MODIFY POST";
            Article.get({
                id: id
            }, function(d) {
                $scope.formData = d;
                /*set exist category*/

                for (var i = 0; i < d.category.length; i++) {
                    $scope.articleCategory.data.push(d.category[i].id)
                }

            })

            $scope.articleAction = function() {
                var article = new Article();
                article.title = $scope.formData.title;
                article.content = $scope.formData.content;
                article.category = $scope.articleCategory.data;
                if (!article.category.length) {
                    notify("fdgdfgd");
                } else {
                    article.$update({
                        id: id
                    }, function() {
                        notify("fdgdfgd");
                        $scope.$on("ngDialog.closed", function() {
                            $scope.$apply(function() {
                                $location.path("/article/list");
                            })
                        })
                    });
                }
            }

        } else {
            /*create post*/
            $scope.action = "NEW POST";
            $scope.articleAction = function() {
                var article = new Articles();
                article.title = $scope.formData.title;
                article.content = $scope.formData.content;

                article.$save({}, function(success) { //post success  callback
                    resetData($scope.formData);
                    $scope.article.$setPristine();
                    notify("Article successfully added")
                }, function(error) { //post error callback
                    notify("Failed to add articles: " + error.statusText)
                });
            }
        }
    }]).
    controller('categoryActionCtr', ['$scope', '$location', 'Categorys', 'Category', '$stateParams', 'ngDialog', function($scope, $location, Categorys, Category, $stateParams, ngDialog) {
        var id = $stateParams.id;
        $scope.formData = {};
        /*category*/
        function resetData(ob) {
            for (var i in ob) {
                if (typeof(ob[i]) == 'string') {
                    ob[i] = "";
                    continue;
                }
                if (ob[i] instanceof Array) {
                    ob[i] = [];
                    continue;
                }
                if (typeof(ob[i]) == "object") {
                    ob[i] = {};
                }
            }
        }

        function notify(info) {
            ngDialog.open({
                template: 'notify',
                data: {
                    action: info
                }
            })
        }

        if (id) {
            /*modify post*/
            $scope.action = "MODIFY CATEGORY";
            Category.get({
                id: id
            }, function(d) {
                $scope.formData = d;
                /*set exist category*/

            })

            $scope.categoryAction = function() {
                var category = new Category();
                category.name = $scope.formData.name;
                category.description = $scope.formData.description;

                category.$update({
                    id: id
                }, function() {
                    notify("update");
                    $scope.$on("ngDialog.closed", function() {
                        $scope.$apply(function() {
                            $location.path("/category/list");
                        })
                    })
                });
            }

        } else {
            /*create post*/
            $scope.action = "NEW CATEGORY";
            $scope.categoryAction = function() {
                var category = new Categorys();
                category.name = $scope.formData.name;
                category.description = $scope.formData.description;

                category.$save({}, function(success) { //post success  callback
                    resetData($scope.formData);
                    $scope.category.$setPristine();
                    notify("Article successfully added")
                }, function(error) { //post error callback
                    notify("Failed to add articles: " + error.statusText)
                });
            }
        }
    }]).
    controller('login', ['$scope', '$window', '$http', 'Auth', function($scope, $window, $http, Auth) {
        $scope.loginData = {};
        $scope.signIn = function() {
            $scope.loading = true;
            $http.post('/api/users', {
                nickname: $scope.loginData.nickname,
                passwd: $scope.loginData.passwd
            }).then(function(d) {
                $scope.loading = false;
                if (d.data.token) {
                    $scope.notice = "You are login in";
                    $scope.dash = true;
                    var token = d.data.token;
                    Auth.setToken(token);
                    $window.sessionStorage["token"] = token;
                } else {
                    $scope.notice = "login in error,try again";
                    $scope.dash = false;
                }
            }, function(error) {
                console.log(error)
            })

        }

    }])
})