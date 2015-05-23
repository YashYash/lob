app.controller('LandingController', [
  '$scope',
  '$timeout',
  'StateService',
  'Upload',
  function(
    $scope,
    $timeout,
    StateService,
    Upload) {
    'use strict';
    console.log('#### Landing Controller');


    // init - check to see if controller has been loaded
    if (!StateService.data['LandingController'].loaded) {
      init();
      animateIntro();
    } else {
      console.log('#### Controller has already loaded');
    }

    function init() {
      // Set Loaded to true
      StateService.data['LandingController'].loaded = true;
    }

    // Animate the introduction
    function animateIntro() {
      var animatedIntroTimeouts = {};
      animatedIntroTimeouts.showheadingname = $timeout(function() {
        StateService.data['LandingController']['Animations'].showHeadingName = true;
        animatedIntroTimeouts.showuploadcontainer = $timeout(function() {
          StateService.data['LandingController']['Animations'].showUploadContainer = true;
        }, 400);
      }, 1200);
    }

    // Ui-responders
    // Allow the dom to get stored data from the service
    $scope.getData = function(type) {
      return StateService.data[type];
    };

    $scope.showOverlay = function() {
    	StateService.data['LandingController']['Animations'].showOverlay = true;
    	$timeout(function() {
    		StateService.data['LandingController']['Animations'].fadeInOverlay = true;
    		StateService.data['LandingController']['Animations'].blurContainer = true;
    	}, 100);
    };

    $scope.hideOverlay = function() {
    	StateService.data['LandingController']['Animations'].fadeInOverlay = false;
    	StateService.data['LandingController']['Animations'].blurContainer = false;
    	$timeout(function() {
    		StateService.data['LandingController']['Animations'].showOverlay = false;
    	}, 400);
    };


    $scope.upload = function(files) {
      if (files && files.length) {
      	$scope.showOverlay();
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          Upload.upload({
            url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
            file: file
          }).progress(function(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            StateService.data['LandingController']['Upload'].progress = progressPercentage;
          }).success(function(data, status, headers, config) {
            console.log('#### File has been uploaded successfully');
            StateService.data['LandingController']['Upload'].name = config.file.name;
            StateService.data['LandingController']['Upload'].data = data;
            console.log(config.file.name);
            console.log(data);

          });
        }
      }
    };
    // Ui-relayers
    $scope.$watch('files', function() {
      $scope.upload($scope.files);
    });
  }
]);
