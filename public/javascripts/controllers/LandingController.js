app.controller('LandingController', [
  '$scope',
  '$state',
  '$timeout',
  'StateService',
  'Upload',
  'FilesService',
  function(
    $scope,
    $state,
    $timeout,
    StateService,
    Upload,
    FilesService) {
    'use strict';
    console.log('#### Landing Controller');


    // init - check to see if controller has been loaded
    if (!StateService.data['LandingController'].loaded) {
      init();
      animateIntro();
    } else {
      console.log('#### Controller has already loaded');
      console.log(StateService.data);
    }
    // Hide add another button
    StateService.data['NavController'].showAddAnotherButton = false;
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

    // Refactor - Create animations service
    // Show the overlay
    $scope.showOverlay = function() {
      StateService.data['LandingController']['Animations'].showOverlay = true;
      $timeout(function() {
        StateService.data['LandingController']['Animations'].fadeInOverlay = true;
        StateService.data['LandingController']['Animations'].blurContainer = true;
      }, 100);
    };

    // Hide the overlay
    $scope.hideOverlay = function() {
      StateService.data['LandingController']['Animations'].fadeInOverlay = false;
      StateService.data['LandingController']['Animations'].blurContainer = false;
      $timeout(function() {
        StateService.data['LandingController']['Animations'].showOverlay = false;
      }, 400);
    };

    // Refactor - Port to its own custom directive with its own view and controller
    // Upload the pdf file - drag n drop or click to upload
    $scope.upload = function(files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (file.type === 'application/pdf') {
            StateService.data['LandingController']['Upload'].status = 'uploading';
            $scope.showOverlay();
            $scope.pdfError = false;
            var headers = {
              'Content-Type': file.type,
            }
            Upload.upload({
            	url:'/api/lob/upload/pdf',
            	method: 'POST',
            	data: {'shit': 'some shit'},
            	file:file
            }).progress(function(evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              StateService.data['LandingController']['Upload'].progress = progressPercentage;
            }).success(function(data, status, headers, config) {
              StateService.data['LandingController']['Upload'].name = config.file.name;
              StateService.data['LandingController']['Upload'].data = data;
              StateService.data['LandingController']['Upload'].status = 'uploaded';
              $timeout(function() {
                StateService.data['LandingController']['Upload'].status = 'success';
                StateService.data['LandingController']['Upload'].convertStatus = 'converting';
                $scope.convertToPng();
              }, 1200);
            }).error(function(err) {
            	console.log(err);
            });
          } else {
            $scope.pdfError = true;
          }
        }
      }
    };

    $scope.convertToPng = function() {
      var data = StateService.data['LandingController']['Upload'].data;
      var convert = FilesService.convert(data);
      convert.then(function(response) {
        if (response.data.status === 'success') {
          StateService.data['ThumbnailsController'].files = response.data.files;
          $timeout(function() {
            StateService.data['LandingController']['Upload'].convertStatus = 'converted';
          }, 1200);
        } else {
          console.log(response.data.error);
          StateService.data['LandingController']['Upload'].status = 'error';
        }
      });
    };

    // Swith to view thumbnails state
    $scope.viewThumbnails = function() {
      $state.go('app.v1.thumbnails');
    };
    $scope.resetDefaults = function() {
      StateService.data['ThumbnailsController'].files = [];
      StateService.data['LandingController']['Upload'].name = '';
      StateService.data['LandingController']['Upload'].status = false;
      StateService.data['LandingController']['Upload'].progress = 0;
      StateService.data['LandingController']['Upload'].convertStatus = false;
      $scope.hideOverlay();
    };

    // Ui-relayers
    // Watch to see if a file has been added to upload
    $scope.$watch('files', function() {
      $scope.upload($scope.files);
    });
  }
]);
