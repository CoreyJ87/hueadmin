#!/usr/bin/env node

'use strict';
var express = require('express');
var app = express();
let huejay = require('huejay');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
const debug=true;
class getClient {

  searchForDevices(){
    if(debug) console.log('Discovering bridges...');
    return huejay.discover()
    .then( (bridges) => {
      if (!bridges.length) {
        if(debug) console.log('--No bridges found--');
        return;
      }
      for (let bridge of bridges) {
        if(debug) console.log(`Bridge Found - Id: ${bridge.id}, IP: ${bridge.ip}`);
        return bridge.ip
      }
    });
  }

  createUser(deviceIP){
    if(debug) console.log('Attempting to create user....');
    if(debug) console.log('Make sure link button on bridge is pressed.....');

    //instantiate default client to make create user call
    let client = new huejay.Client({
      host:     deviceIP,
      username: 'default'  //'faDU2YmXESWEGdLea3kkZi-8CB7tSuhuPl6ZDBob'
    });
    if(debug) console.log(client);

    let user = new client.users.User;
    user.deviceType = 'customDevice';

    //Create actual user and return it.
    return client.users.create(user)
    .then(user => {
      console.log(`New user: ${user.username} created. With device type: ${user.deviceType}`);

      let saveData = {}
      saveData.deviceIP=deviceIP;
      saveData.user=user.username;
      //Write user/deviceip to creds file
      fs.writeFile("./creds", JSON.stringify(saveData), function(err) {
        if(err) {
          return console.log(err);
        }
      });
      return user.username;
    })
    .catch(error => {
      if (error instanceof huejay.Error && error.type === 101) {
        return console.log(`Link button not pressed. Try again...`);
      }
      console.log(error.stack);
    })
    .catch(error => {
      console.log(error.message);
    });
  }
}
  module.exports = getClient;
