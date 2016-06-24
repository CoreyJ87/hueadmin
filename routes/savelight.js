var express = require('express');
var router = express.Router();
var huejay = require('huejay');
const getClient = require('../getClient');
const Client = new getClient();

//List all current users
router.post('/',function (req,res){
  var obj = {};
	console.log('body: ' + JSON.stringify(req.body));
  let client=req.theclient;
    if(req.body.id){
      client.lights.getById(req.body.id)
      .then(light => {
        if(req.body.brightness) light.brightness = req.body.brightness;
        if(req.body.hue) light.hue = req.body.hue;
        if(req.body.saturation) light.saturation = req.body.saturation;
        if(typeof(req.body.enabled) != undefined) light.on = req.body.enabled;
        return client.lights.save(light);
      })
      .then(light => {
        console.log(`Updated light [${light.id}]`);
        res.send(`Updated light [${light.id}]`)
      })
      .catch(error => {
        console.log('Something went wrong');
        console.log(error.stack);
      });
    }
});

module.exports = router;
