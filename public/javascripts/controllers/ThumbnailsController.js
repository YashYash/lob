app.controller('ThumbnailsController', [
  '$scope',
  '$state',
  'StateService',
  function(
    $scope,
    $state,
    StateService) {
    'use strict';
    console.log('#### Thumbnails Controller');

    if (!StateService.data['ThumbnailsController'].files.length) {
      $state.go('app.v1.landing');
    } else {
      console.log(StateService.data['ThumbnailsController'].files)
    }
    if (!StateService.data['ThumbnailsController'].loaded) {
      init();
    } else {
      console.log('#### Controller has already loaded');
    }

    function init() {
      // Set loaded to true
      StateService.data['ThumbnailsController'].loaded = true;
    }

    // Ui-responders
    $scope.getData = function(type) {
      return StateService.data[type];
    };
  }
])
