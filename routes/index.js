var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var _ = require('lodash');

router.get('/', function(req, res, next) {
  var lights = [];
  var users = [];
  var lightOpts = {
    method: 'POST',
    uri: 'http://localhost:3000/getlightinfo',
    json: true
  };
  var userOpts = {
    method: 'POST',
    uri: 'http://localhost:3000/users',
    json: true
  };

  if(req.theclient!=null){
    rp(lightOpts).then(function (body) {
      _.forIn(body, function(value, key) {
        var attrib = value.attributes.attributes;
        var name = attrib.name;
        var id = attrib.id;
        var state = value.state.attributes.on;
        var onClass;
        if(state){
          onClass='lightOn btn-success'
        }
        else{
          onClass='lightOff btn-danger';
        }
        lights.push({
          'name'   : name,
          'id' : id,
          'onClass' : onClass,
        });
      });
    })
    .catch(function (err) {
      console.log(err)
    }).finally(function(){
      rp(userOpts).then(function (body) {
        _.forIn(body, function(value, key) {
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
        })
      })
      .catch(function (err) {
        console.log(err)
      }).finally(function(){
        var alwaysData = {title: 'SyNHue Admin',user: req.theclient.config.username,deviceIP: req.theclient.config.host};
        var hopefullyData = {lightConsole: JSON.stringify(lights),lightData: lights,userData: users }
        var renderData = {};
        _.merge(renderData,alwaysData);
        _.merge(renderData,hopefullyData);
        res.render('index',renderData);
      })
    })
  }
});

module.exports = router;
