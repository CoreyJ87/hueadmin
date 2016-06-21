#!/usr/bin/env node

'use strict';
var express = require('express');
var app = express();
let huejay = require('huejay');
var fs = require('fs');
class getClient {

  searchForDevices(){
    console.log('Discovering bridges...');
    return huejay.discover()
    .then( (bridges) => {
      if (!bridges.length) {
        console.log('- No bridges found');
        return;
      }
      for (let bridge of bridges) {
        console.log(`- Id: ${bridge.id}, IP: ${bridge.ip}`);
        return bridge.ip
      }
    });
  }

  getUserFromFile(deviceIP){
    console.log('Creds file exists. Reading userID');
    return fs.readFileSync('./creds', 'utf8')
  }

  createUser(deviceIP){
    console.log('Attempting to create user....');
    console.log('Make sure link button on bridge is pressed.....');

    //instantiate default client to make create user call
    let client = new huejay.Client({
      host:     deviceIP,
      username: 'default'  //'faDU2YmXESWEGdLea3kkZi-8CB7tSuhuPl6ZDBob'
    });
    console.log(client);

    let user = new client.users.User;
    user.deviceType = 'customDevice';
    //Create actual user
    return client.users.create(user)
    .then(user => {
      console.log(`New user: ${user.username} created. With device type: ${user.deviceType}`);
      //Write user to creds file
      fs.writeFile("./creds", user.username, function(err) {
        if(err) {
          return console.log(err);
        }
      });
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
