define(['app','ngDialog','tinymce'], function(app) {
    app.
    directive('remove', ['Post', '$timeout', 'ngDialog', function(Post, $timeout, ngDialog) {
        return {
            restrict: 'AE',
            scope: '=',
            controller: function($scope, $element, $attrs, $transclude) {},
            link: function(scope, elem, attr) {
                elem.bind('click', function(event) {
                    event.preventDefault();
                    ngDialog.openConfirm({ //popup dialog to confire some action
                        template: 'popConfirm',
                        className: 'ngdialog-theme-default'
                    }).then(function(value) { // do action
                        var handle;
                        switch (attr.type) {
                            case "post":
                                handle = Post
                        }
                        handle.delete({
                            id: attr.item
                        }, function(d) {
                            scope.dataList.splice(attr.index, 1);
                            var dialog = ngDialog.open({
                                template: 'notify',
                                data: {
                                    action: "删除操作"
                                }
                            })
                            setTimeout(function() {
                                dialog.close();
                            }, 500)

                        });
                    }, function(reason) { // cancle action
                        console.log(reason);
                    });
                });
            }
        }
    }]).
    directive('uiTinymce', ['$rootScope', '$timeout', function($rootScope, $timeout) {
        var uiTinymceConfig = {};
        var generatedIds = 0;
        return {
            priority: 10,
            require: 'ngModel',
            link: function(scope, elm, attrs, ngModel) {
                var expression, options, tinyInstance,
                    updateView = function() {
                        ngModel.$setViewValue(elm.val());
                        if (!$rootScope.$$phase) {
                            scope.$apply();
                        }
                    };

                // generate an ID if not present
                if (!attrs.id) {
                    attrs.$set('id', 'uiTinymce' + generatedIds++);
                }

                if (attrs.uiTinymce) {
                    expression = scope.$eval(attrs.uiTinymce);
                } else {
                    expression = {};
                }

                // make config'ed setup method available
                if (expression.setup) {
                    var configSetup = expression.setup;
                    delete expression.setup;
                }

                options = {
                    // Update model when calling setContent (such as from the source editor popup)
                    setup: function(ed) {
                        var args;
                        ed.on('init', function(args) {
                            ngModel.$render();
                            ngModel.$setPristine();
                        });
                        // Update model on button click
                        ed.on('ExecCommand', function(e) {
                            ed.save();
                            updateView();
                        });
                        // Update model on keypress
                        ed.on('KeyUp', function(e) {
                            ed.save();
                            updateView();


                        });
                        // Update model on change, i.e. copy/pasted text, plugins altering content
                        ed.on('SetContent', function(e) {
                            if (!e.initial && ngModel.$viewValue !== e.content) {
                                ed.save();
                                updateView();
                            }
                        });
                        ed.on('blur', function(e) {
                            //elm.blur();
                        });
                        // Update model when an object has been resized (table, image)
                        ed.on('ObjectResized', function(e) {
                            ed.save();
                            updateView();

                        });
                        if (configSetup) {
                            configSetup(ed);
                        }
                    },
                    mode: 'exact',
                    elements: attrs.id,
                    skin: "lightgray",
                    //language: 'zh_CN',
                    relative_urls: false,
                    //font_formats: '微软雅黑=微软雅黑;宋体=宋体;黑体=黑体;仿宋=仿宋;楷体=楷体;隶书=隶书;幼圆=幼圆;',
                    plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table contextmenu paste textcolor wordcount"
                    ],
                    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | forecolor backcolor | fontselect fontsizeselect | advimage"
                };
                // extend options with initial uiTinymceConfig and options from directive attribute value
                angular.extend(options, uiTinymceConfig, expression);

                $timeout(function() {
                    tinymce.init(options);
                })

                ngModel.$render = function() {

                    if (!tinyInstance) {
                        tinyInstance = tinymce.get(attrs.id);

                    }
                    if (tinyInstance) {
                        tinyInstance.setContent(ngModel.$viewValue || '');
                    }
                };

                scope.$on('$destroy', function() {
                    if (!tinyInstance) {
                        tinyInstance = tinymce.get(attrs.id);
                    }
                    if (tinyInstance) {
                        $timeout(function() {
                            tinyInstance.remove();
                            tinyInstance = null;
                        }, 1000)
                    }

                });
            }
        };
    }]).
    directive('dashFor', ['$location', function($location) {
            return {
                restrict: 'AE',
                scope: '=',
                link: function(scope, elem, attrs) {
                    scope.$on('$locationChangeSuccess', function() {
                        as = elem.find('a');
                        for (var i = 0; i < as.length; i++) {
                            index = as[i].href.indexOf('#') ? as[i].href.indexOf('#') : 0;
                            localurl = as[i].href.slice(index + 1);
                            if (localurl == $location.path()) {
                                as[i].classList.add('active');
                            } else {
                                as[i].classList.remove('active');
                            }

                        }
                    })
                }
            }
        }])
        // directive('script', function() {
        //     return {
        //         restrict: 'E',
        //         scope: false,
        //         link: function(scope, elem, attr) {
        //             var angularCorrections = //Document.write
        //                 function(code) {
        //                     var parentNode = elem[0].parentNode;
        //                     if (!parentNode.id) parentNode.id = Date.now() + '_' + Math.floor((Math.random() * 10) + 1); //replace with your own random id generator
        //                     var re = new RegExp("document.write(ln)?", "g"); //Support for Document.write only 
        //                     var newCode = code.replace(re, "document.getElementById('" + parentNode.id + "').innerHTML += ");
        //                     console.log(newCode);
        //                     return newCode;
        //                 };
        //             if (attr.type === 'text/javascript-lazy') {
        //                 var s = document.createElement("script");
        //                 s.type = "text/javascript";
        //                 var src = elem.attr('src');
        //                 if (src !== undefined) {
        //                     s.src = src;
        //                 } else {
        //                     var code = elem.text();
        //                     s.text = angularCorrections(code);
        //                 }
        //                 document.head.appendChild(s);
        //                 elem.remove();
        //             }
        //         }
        //     };
        // })
})