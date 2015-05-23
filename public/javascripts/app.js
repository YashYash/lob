var app = angular.module('app', ['ionic', 'ngStorage', 'ngSanitize', 'ngFileUpload']);
'use strict';

console.log('#### APP JS LOADED: app');
app.run(['$rootScope', function($rootScope) {
	console.log('#### App.js .run');
}]);

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  console.log('#### State provider working');
  $urlRouterProvider.otherwise('/');
  $stateProvider

	.state('app', {
		url: '/',
		views: {
			'global': {
				templateUrl: '/views/global.html',
				controller: 'GlobalController'
			}
		}
	})
	.state('app.v1', {
	  url: 'tab',
	  abstract: true,
	  views: {
	    'global@': {
	      templateUrl: '/views/v1/v1.html',
	      controller: 'RootController'
	    },
	    'nav@app.v1': {
	      templateUrl: '/views/v1/nav.html',
	      controller: 'NavController'
	    },
	    'content@app.v1': {
	      templateUrl: '/views/v1/content.html',
	      controller: 'ContentController'
	    }     
	  }
    })
    .state('app.v1.landing', {
      url: '/landing',
      views: {
        'content@app.v1': {
          templateUrl: '/views/v1/landing.html',
          controller: 'LandingController'
        }
      }
    })                
}]);




