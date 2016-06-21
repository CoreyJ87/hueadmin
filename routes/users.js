var express = require('express');
var router = express.Router();
var huejay = require('huejay');
const getClient = require('../getClient');
const Client = new getClient();

//List all current users
router.get('/',function (req,res){
  let client=req.theclient;
  client.users.getAll()
  .then(users => {
    var userString = '';
    for (let user of users) {
      userString += `Username: ${user.username}<br>`;
      console.log(`Username: ${user.username}`);
    }
    res.render('users', { users: userString });
  });
});

module.exports = router;
