require.config({
    baseUrl: "/static/js/admin",
    paths: {
        'angular': [
            // 'http://cdn.bootcss.com/angular.js/1.3.0-beta.13/angular',
            '/static/components/angular/angular.min'
        ],
        'angular-resource': [
            // 'http://cdn.bootcss.com/angular.js/1.3.0-beta.13/angular-resource.min',
            '/static/components/angular-resource/angular-resource.min'
        ],
        'angular-animate': [
            // 'http://cdn.bootcss.com/angular.js/1.3.0-beta.13/angular-animate.min',
            '/static/components/angular-animate/angular-animate.min'
        ],
        'angular-sanitize': [
            // 'http://cdn.bootcss.com/angular.js/1.3.0-beta.13/angular-sanitize.min',
            '/static/components/angular-sanitize/angular-sanitize.min'
        ],
        'angular-ui-router': [
            // 'http://cdn.bootcss.com/angular-ui-router/0.2.11/angular-ui-router.min',
            '/static/components/angular-ui-router/release/angular-ui-router.min'
        ],
        'checklist':[
            '/static/components/checklist-model/checklist-model'
        ],
        'ngDialog':[
            '/static/components/ngDialog/js/ngDialog.min'
        ],
        'tinymce':[
            '/static/components/tinymce/tinymce.min'
        ],
        "services":'../services'
    },
    shim:{
        'angular':{
            exports:'angular'
        },
        'angular-resource':{
            deps:['angular'],
            exports:'angular-resource'
        },
        'angular-animate':{
            deps:['angular'],
            exports:'angular-animate'
        },
        'angular-sanitize':{
            deps:['angular'],
            exports:'angular-sanitize'
        },
        'angular-ui-router':{
            deps:['angular'],
            exports:'angular-ui-router'
        }
    }
});
require(['angular','app','router','controllers','directives'], function(angular) {
    // 启动ng
    angular.bootstrap(document, ['admin']);

});