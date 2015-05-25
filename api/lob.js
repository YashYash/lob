'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var async = require('async');
var exec = require('child_process').exec;
var async = require('async');
var fs = require('fs');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();


// Delete the existing pdfs
// Create the new pdf file
// Send the client the name of the pdf file
router.post('/upload/pdf', multipartyMiddleware, function(req, res) {
  var file = req.files.file;
  var pdf = file.path;
  var path = './public/images/pdfs/';
  var fileName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + '.pdf';
  var command = 'convert ' + pdf + ' ' + path + fileName;

  async.waterfall([
    function(callback) {
      // Delete the existing pdf files
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
            if (err) {
              callback(err);
            } else {
              callback(null);
            }
          })
        }
      })
    },
    function(callback) {
      exec(command, function(err, stdout, stderr) {
        if (err !== null) {
          console.log('exec error: ' + err);
          callback(err);
        } else {
          var data = {
            fileName: fileName
          }
          res.send(data);
        }
      });
    }
  ], function(err) {
    console.log(err);
    var response = {
      status: 'error',
      error: err
    }
    res.send(response);
  })
});

// Using only command line imagemagic to covert the pdf to an array of pngs
// Delete the existing pngs 
// Create new pngs and send them back to client
router.post('/convert', function(req, res) {
  var path = './public/images/pngs/';
  var pdfUrl = './public/images/pdfs/' + req.body.fileName;
  var randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  var fileName = randomString + '.png';
  var command = 'convert ' + pdfUrl + ' ' + path + fileName;

  async.waterfall([
    function(callback) {
      // Delete the existing png files
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
            if (err) {
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
