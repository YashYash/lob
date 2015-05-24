app.controller('LandingController', [
  '$scope',
  '$state',
  '$timeout',
  'StateService',
  'Upload',
  'FileConvert',
  function(
    $scope,
    $state,
    $timeout,
    StateService,
    Upload,
    FileConvert) {
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
      StateService.data['LandingController']['Upload'].status = 'uploading';
      if (files && files.length) {
        $scope.showOverlay();
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          console.log(file);
          Upload.upload({
            url: 'https://s3-us-west-2.amazonaws.com/lob-coding-challenge/images/',
            method: 'PUT',
            fields: {
              key: file.name + new Date(),
              AWSAccessKeyId: 'AKIAJAHP2MO6QAWWT5KQ',
              acl: 'public-read',
              Principal: "*",
              policy: "ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImxvYi1jb2RpbmctY2hhbGxlbmdlIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICB7ImFjbCI6ICJwcml2YXRlIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRmaWxlbmFtZSIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCA1MjQyODgwMDBdCiAgXQp9",
              signature: "cD2VIlQx8QYIQkh4H3j54UtspfY=",
              "Content-Type": file.type != '' ? file.type : 'application/octet-stream',
              filename: file.name
            },
            file: file
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
            }, 2000);
          });
        }
      }
    };

    $scope.convertToPng = function() {
      console.log(StateService.data['LandingController']['Upload'].data);
      var file = {
        name: StateService.data['LandingController']['Upload'].name,
        data: StateService.data['LandingController']['Upload'].data
      }
      var convert = FileConvert.convert(file);
      convert.then(function(response) {
        if (response.data.status === 'success') {
          StateService.data['ThumbnailsController'].files = response.data.files;
          console.log('#########');
          console.log(StateService.data['ThumbnailsController'].files);
          $timeout(function() {
            StateService.data['LandingController']['Upload'].convertStatus = 'converted';
          }, 1200);
          console.log('#### Successful response');
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
    // Ui-relayers
    // Watch to see if a file has been added to upload
    $scope.$watch('files', function() {
      $scope.upload($scope.files);
    });
  }
]);
