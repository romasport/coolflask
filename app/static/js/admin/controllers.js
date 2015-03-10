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
    controller('tagListCtr', ['$scope', 'getList', function($scope, getList) {
        getList('tag', 1, 10).success(function(data) {
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
    controller('articleActionCtr', ['$scope', '$location', 'Articles', 'Article', '$stateParams', 'Categorys', 'Category', 'Tags', 'Tag', 'ngDialog', function($scope, $location, Articles, Article, $stateParams, Categorys, Category, Tags, Tag, ngDialog) {
        var id = $stateParams.id;
        $scope.formData = {};

        $scope.articleCategory = {};
        Categorys.query(function(d) {
            $scope.categoryList = d;
        });
        $scope.createCategory = "";
        $scope.articleCategory.data = [];

        $scope.articleTag = {};
        Tags.query(function(d) {
            $scope.tagList = d;
        });
        $scope.createTag = "";
        $scope.articleTag.data = [];

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

        $scope.tg = {};

        $scope.tagAdd = function() {

            var tag = new Tags();
            tag.name = $scope.tg.name;
            tag.$save(function() {
                Tag.get({
                    id: $scope.tg.name
                }, function(d) {
                    $scope.tagList.push({
                            'id': d.id,
                            'name': d.name
                        });
                    resetData($scope.tg);
                    $scope.tag.$setPristine();
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

                for (var i = 0; i < d.tag.length; i++) {
                    $scope.articleTag.data.push(d.tag[i].id)
                }

            })

            $scope.articleAction = function() {
                var article = new Article();
                article.title = $scope.formData.title;
                article.content = $scope.formData.content;
                article.category = $scope.articleCategory.data;
                article.tag = $scope.articleTag.data;
                if (!article.category.length) {
                    notify("Необходимо выбрать категорию");
                } else {
                    article.$update({
                        id: id
                    }, function() {
                        notify("Запись обновленна");
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
                article.category = $scope.articleCategory.data;
                if (!article.category.length) {
                    notify("error");
                } else {
                    article.$save({}, function (success) { //post success  callback
                        resetData($scope.formData);
                        $scope.articleCategory.data = [];
                        $scope.article.$setPristine();
                        notify("Article successfully added");
                    }, function (error) { //post error callback
                        notify("Failed to add articles: " + error.statusText);
                    });
                }
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
    controller('tagActionCtr', ['$scope', '$location', 'Tags', 'Tag', '$stateParams', 'ngDialog', function($scope, $location, Tags, Tag, $stateParams, ngDialog) {
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
            $scope.action = "MODIFY TAG";
            Tag.get({
                id: id
            }, function(d) {
                $scope.formData = d;
                /*set exist category*/

            })

            $scope.tagAction = function() {
                var tag = new Tag();
                tag.name = $scope.formData.name;

                tag.$update({
                    id: id
                }, function() {
                    notify("update");
                    $scope.$on("ngDialog.closed", function() {
                        $scope.$apply(function() {
                            $location.path("/tag/list");
                        })
                    })
                });
            }

        } else {
            /*create post*/
            $scope.action = "NEW TAG";
            $scope.tagAction = function() {
                var tag = new Tags();
                tag.name = $scope.formData.name;

                tag.$save({}, function(success) { //post success  callback
                    resetData($scope.formData);
                    $scope.tag.$setPristine();
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

    }]).controller('MyCtrl', ['$scope', '$upload', function ($scope, $upload) {
        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });

        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    $upload.upload({
                        url: 'upload/url',
                        fields: {'username': $scope.username},
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    });
                }
            }
        };
    }])
})