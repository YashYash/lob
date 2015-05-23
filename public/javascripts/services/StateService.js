app.service('StateService', [function() {
  'use strict';
  console.log('#### State Service');

  var data = {
    'LandingController': {
      'Upload': {
        'image': false,
        'progress': 0,
        'name': false,
        'data': false,
        'status': false
      },
      'Animations': {
        'showHeadingName': false,
        'showUploadContainer': false,
        'showOverlay': false,
        'fadeInOverlay': false,
        'blurContainer': false
      }
    }
  }
  return {
    data: data
  }
}])
