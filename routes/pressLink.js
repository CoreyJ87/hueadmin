var express = require('express');
var router = express.Router();

//List all current users
router.post('/',function (req,res){
  let client=req.theclient;
    client.bridge.linkButton()
    .then(() => {
      console.log('Link button was pressed');
      res.json({link: 'pressed'})
    });

});


module.exports = router;
