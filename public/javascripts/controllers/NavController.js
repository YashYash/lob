app.controller('NavController', [
  '$scope',
  '$rootScope',
  '$state',
  'StateService',
  function(
    $rootScope,
    $scope,
    $state,
    StateService) {
    'use strict';
    console.log('#### Nav Controller');

    $scope.getData = function(type) {
    	return StateService.data[type];
    };
    $scope.toLanding = function() {
      $state.go('app.v1.landing');
    };
  }
]);
