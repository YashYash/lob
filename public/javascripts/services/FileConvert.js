app.service('FileConvert', [
  '$http',
  function($http) {
    'use strict';
    return {
    	convert: function(file) {
    		var data = {
    			file: 'https://s3-us-west-2.amazonaws.com/lob-coding-challenge/images/pdfurl-guide.pdf'
    		}
    		var url = '/api/lob/convert';
    		var result = $http.post(url, data).then(function(response) {
    			return response
    		})
    		return result;
    	}
    }
  }
])
