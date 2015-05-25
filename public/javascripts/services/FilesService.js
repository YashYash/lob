app.service('FilesService', [
  '$http',
  function($http) {
    'use strict';
    return {
    	convert: function(data) {
    		var url = '/api/lob/convert';
    		var result = $http.post(url, data).then(function(response) {
    			return response
    		})
    		return result;
    	},
    	uploadPdf: function(file) {
    		console.log(file);
    		var url = '/api/lob/upload/pdf';
    		var data = file;    		
    		console.log('#### Making request');
    		var result = $http.post(url, data).then(function(response) {
    			console.log('#### Made request');
    			return response;
    		});
    		return result;
    	}
    }
  }
])
