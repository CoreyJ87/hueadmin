var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('lodash');

router.get('/', function(req, res, next) {
  request.post('http://localhost:3000/users', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var users = [];
      _.forIn(JSON.parse(body), function(value, key) {
        var attrib = value.attributes.attributes;
        var name = attrib.name;
        var username = attrib.username;
        var deviceType = attrib.deviceType;
        var lastUse = attrib['last use date'];
          users.push({
          'name'   : name,
          'username' : username,
          'deviceType' : deviceType,
          'lastUse' : lastUse
        });
      });
      res.render('index', {userData: users, title: 'SyNHue Admin',user: req.theclient.config.username,deviceIP: req.theclient.config.host });
    }
  });
});

module.exports = router;
