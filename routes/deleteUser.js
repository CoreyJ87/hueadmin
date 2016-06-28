var express = require('express');
var router = express.Router();

//List all current users
router.post('/',function (req,res){
  let client=req.theclient;
  if(req.body.deletedUser){
    client.users.delete(req.body.deletedUser)
    .then(() => {
      console.log(`${req.body.deletedUser} was deleted`);
      var data = { deletedUser: req.body.deletedUser};
      res.json(data);
    })
    .catch(error => {
      console.log(error.stack);
    });
  }
});


module.exports = router;
