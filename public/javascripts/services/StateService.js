app.service('StateService', [function() {
  'use strict';
  console.log('#### State Service');

  var data = {
    'LandingController': {
      'Upload': {
        'progress': 0,
        'name': '',
        'data': false,
        'status': false,
        'convertStatus': false
      },
      'Animations': {
        'showHeadingName': false,
        'showUploadContainer': false,
        'showOverlay': false,
        'fadeInOverlay': false,
        'blurContainer': false
      },
      'loaded': false
    },
    'ThumbnailsController': {
    	'loaded': false,
    	'files': []
    }
  }
  return {
    data: data
  }
}])
