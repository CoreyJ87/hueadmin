var express = require('express');
var router = express.Router();

//List all current users
router.post('/',function (req,res){
  let client=req.theclient;
  client.users.getAll()
  .then(users => {
  res.json(users);
  });
});

module.exports = router;
