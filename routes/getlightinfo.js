var express = require('express');
var router = express.Router();
var huejay = require('huejay');
const getClient = require('../getClient');
const Client = new getClient();
const debug=true;
//Get all lights data - old function will end up having its own route like users
router.post('/',function (req,res){
  let client = req.theclient;
  let lightstring = '';
  if(req.body.id){
    client.lights.getById(req.params.id)
    .then(light => {
      if(debug) console.log('Found light:');
      if(debug) console.log(`  Light [${light.id}]: ${light.name}`);
      res.json(light)
    })
    .catch(error => {
      console.log('Could not find light');
      console.log(error.stack);
    });
  }
  else{
    client.lights.getAll()
    .then(lights => {
      res.json(lights);
    });
  }

});

module.exports = router;
