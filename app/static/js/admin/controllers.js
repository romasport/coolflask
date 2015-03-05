define(['app','services','ngDialog','angular-ui-router'],function(app){
    app.
    controller('articleListCtr', ['$scope', 'getList', function($scope, getList) {
        getList('article', 1, 10).success(function(data) {
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
    controller('postActionCtr', ['$scope', '$location', 'Posts', 'Post', '$stateParams', 'ngDialog', function($scope, $location, Posts, Post, $stateParams, ngDialog) {
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
            $scope.action = "MODIFY POST";
            Post.get({
                id: id
            }, function(d) {
                $scope.formData = d;
                /*set exist category*/

            })

            $scope.postAction = function() {
                var post = new Post();
                post.title = $scope.formData.title;
                post.body = $scope.formData.body;

                post.$update({
                    id: id
                }, function() {
                    notify("update");
                    $scope.$on("ngDialog.closed", function() {
                        $scope.$apply(function() {
                            $location.path("/article/list");
                        })
                    })
                });
            }

        } else {
            /*create post*/
            $scope.action = "NEW POST";
            $scope.postAction = function() {
                var post = new Posts();
                post.title = $scope.formData.title;
                post.body = $scope.formData.body;

                post.$save({}, function(success) { //post success  callback
                    resetData($scope.formData);
                    $scope.post.$setPristine();
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