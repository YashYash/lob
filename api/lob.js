'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var async = require('async');
var exec = require('child_process').exec;
var async = require('async');
var fs = require('fs');

router.post('/convert', function(req, res) {
  var path = './public/images/';
  var pdfUrl = req.body.file;
  var randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  var fileName = randomString + '.png';
  var command = 'convert ' + pdfUrl + ' ' + path + fileName;

  async.waterfall([
    function(callback) {
    	// Delete the existing files
      fs.readdir(path, function(err, files) {
        if (err) {
          callback(err);
        } else {
          async.eachSeries(files, function(file, next) {
            fs.unlink(path + file, function(err) {
              if (err) {
                callback(err);
              } else {
                next();
              }
            })
          }, function(err) {
          	if(err) {
          		callback(err);
          	} else {
          		callback(null);
          	}
          })
        }
      })
    },
    function(callback) {
    	// Execute command to convert pdf to png thumbnails
      exec(command, function(err, stdout, stderr) {
        if (err !== null) {
          console.log('exec error: ' + err);
          callback(err);
        } else {
          callback(null, 'success');
        }
      });
    },
    function(status) {
    	// Send the files to client
      fs.readdir(path, function(err, files) {
        console.log(files);
        var response = {
        	status: status,
        	files: files
        }
        res.send(response);
      })
    }
  ], function(err) {
  	// Catch any errors that occur during the waterfall
    if (err) {
      console.log(err);
      var response = {
      	status: 'error',
      	error: err
      }
      res.send(response);
    }
  })
});


module.exports = router;
