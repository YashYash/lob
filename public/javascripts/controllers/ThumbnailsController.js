app.controller('ThumbnailsController', [
  '$scope',
  '$state',
  '$timeout',
  '$ionicSlideBoxDelegate',
  'StateService',
  function(
    $scope,
    $state,
    $timeout,
    $ionicSlideBoxDelegate,
    StateService) {
    'use strict';
    console.log('#### Thumbnails Controller');

    if (StateService.data['ThumbnailsController'].files.length < 1) {
      $state.go('app.v1.landing');
    }
    if (!StateService.data['ThumbnailsController'].loaded) {
      init();
    } else {
      console.log('#### Controller has already loaded');
    }
    $timeout(function() {
      if (StateService.data['ThumbnailsController'].currentSlide > 0) {
        $scope.slideTo(StateService.data['ThumbnailsController'].currentSlide);
      }
    }, 500);

    function init() {
      // Set loaded to true
      StateService.data['ThumbnailsController'].loaded = true;
      StateService.data['ThumbnailsController'].currentSlide = 0;
    }

    // Ui-responders
    $scope.getData = function(type) {
      return StateService.data[type];
    };
    $scope.nextSlide = function() {
    	StateService.data['ThumbnailsController'].currentSlide++;
    	$ionicSlideBoxDelegate.$getByHandle('bigslider').next();	
    };
    $scope.previousSlide = function() {
    	StateService.data['ThumbnailsController'].currentSlide--;
    	$ionicSlideBoxDelegate.$getByHandle('bigslider').previous();	
    };    
    $scope.slideTo = function(index) {
      StateService.data['ThumbnailsController'].currentSlide = index;
      $ionicSlideBoxDelegate.$getByHandle('bigslider').slide(index);
    };
  }
])
