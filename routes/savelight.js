var express = require('express');
var router = express.Router();
var huejay = require('huejay');
const getClient = require('../getClient');
const Client = new getClient();
const debug=true;
//List all current users
router.post('/',function (req,res){
  var obj = {};
	if(debug) console.log('body: ' + JSON.stringify(req.body));
  let client=req.theclient;
    if(req.body.id){
      console.log(req.body)
      client.lights.getById(req.body.id)
      .then(light => {
        if(req.body.brightness) light.brightness = req.body.brightness;
        if(req.body.hue) light.hue = req.body.hue;
        if(req.body.saturation) light.saturation = req.body.saturation;
        if(req.body.alert) light.alert = req.body.alert;
        if(req.body.effect) light.effect = req.body.effect;
        if(typeof(req.body.on) != undefined) light.on = req.body.on;
        if(req.body.colorMode != undefined) light.colorMode = req.body.colorMode;
        return client.lights.save(light);
      })
      .then(light => {
        if(debug) console.log(`Updated light [${light.id}]`);
        data = {lightid: `${light.id}`}
        res.json(data);
      })
      .catch(error => {
        console.log('Something went wrong');
        console.log(error.stack);
      });
    }
});

module.exports = router;
