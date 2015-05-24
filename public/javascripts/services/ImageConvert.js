app.service('FileConvert', [
  '$http',
  function($http) {
    'use strict';
    return {
    	convert: function(from, to, quality, size) {
    		console.log(from);
    		console.log(to);
    		console.log(quality);
    		console.log(size);
    		return 'blah bro';
    	}
    }
  }
])
