app.controller('NavController', [
  '$scope',
  '$rootScope',
  '$state',
  function(
    $rootScope,
    $scope,
    $state) {
    'use strict';
    console.log('#### Nav Controller');
    $scope.toLanding = function() {
      $state.go('app.v1.landing');
    }
  }
]);
