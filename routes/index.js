var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var Account = require('../models/account');
var async = require('async');
var ff = require('ff');

router.get('/', function(req, res) {
  res.render('index', {
    title: 'Express'
  });
});

// Register

module.exports = router;
