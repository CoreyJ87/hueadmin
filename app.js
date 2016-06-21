var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var huejay = require('huejay');
var fs = require('fs');
var routes = require('./routes/index');
var users = require('./routes/users');

const getClient = require('./getClient');
const Client = new getClient();
var app = express();
var router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next){
  Client.searchForDevices().then((deviceIP) => {
    req.deviceIP = deviceIP;
    next();
  });
});
app.use(function (req,res,next){
  //Check if creds file exists
  fs.stat('./creds', function(err, stat) {
    if(err == null) {
      //Since the creds file does exist. Grab userid from creds file and instantiate client. Attach client to request.
      let user=Client.getUserFromFile(req.deviceIP);
      console.log(`returned: ${user}`)
      req.theclient = new huejay.Client({
        host:     req.deviceIP,
        username: user
      });
      console.log(req.theclient);
      next();
    } else if(err.code == 'ENOENT') {
      Client.createUser(req.deviceIP).then((user) =>{
        console.log(`we got back: ${user}`)
        //User does not exist now we create and instantiate new client /w created user. Then attach client to the request.
        if(user != undefined){
          req.theclient = new huejay.Client({
            host:     req.deviceIP,
            username: user
          });
          console.log(req.theclient);
          next();
        }
        else {
          res.send('link button not pressed');
        }
      });
    } else {
      console.log('Some other error: ', err.code);
      res.send('Somethings fucky');
    }
  });
});


app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//Get all lights data - old function will end up having its own route like users
app.get('/getlightinfo/:id?',function (req,res){
  let client = req.theclient;
  let lightstring = '';

  if(req.params.id){
    client.lights.getById(req.params.id)
    .then(light => {
      console.log('Found light:');
      console.log(`  Light [${light.id}]: ${light.name}`);
      lightstring += `Light [${light.id}]: ${light.name}<br>`
      lightstring += `  Type:             ${light.type}<br>`
      lightstring += `  Unique ID:        ${light.uniqueId}<br>`
      lightstring += `  Manufacturer:     ${light.manufacturer}<br>`
      lightstring += `  Model Id:         ${light.modelId}<br>`
      lightstring += '  Model:<br>'
      lightstring += `    Id:             ${light.model.id}<br>`
      lightstring += `    Manufacturer:   ${light.model.manufacturer}<br>`
      lightstring += `    Name:           ${light.model.name}<br>`
      lightstring += `    Type:           ${light.model.type}<br>`
      lightstring += `    Color Gamut:    ${light.model.colorGamut}<br>`
      lightstring += `    Friends of Hue: ${light.model.friendsOfHue}<br>`
      lightstring += `  Software Version: ${light.softwareVersion}<br>`
      lightstring += '  State:<br>'
      lightstring += `    On:         ${light.on}<br>`
      lightstring += `    Reachable:  ${light.reachable}<br>`
      lightstring += `    Brightness: ${light.brightness}<br>`
      lightstring += `    Color mode: ${light.colorMode}<br>`
      lightstring += `    Hue:        ${light.hue}<br>`
      lightstring += `    Saturation: ${light.saturation}<br>`
      lightstring += `    X/Y:        ${light.xy[0]}, ${light.xy[1]}<br>`
      lightstring += `    Color Temp: ${light.colorTemp}<br>`
      lightstring += `    Alert:      ${light.alert}<br>`
      lightstring += `    Effect:     ${light.effect}<br>`
      res.send(lightstring)
    })
    .catch(error => {
      console.log('Could not find light');
      console.log(error.stack);
    });
  }
  else{
    client.lights.getAll()
    .then(lights => {
      for (let light of lights) {
        lightstring += `Light [${light.id}]: ${light.name}<br>`
        lightstring += `  Type:             ${light.type}<br>`
        lightstring += `  Unique ID:        ${light.uniqueId}<br>`
        lightstring += `  Manufacturer:     ${light.manufacturer}<br>`
        lightstring += `  Model Id:         ${light.modelId}<br>`
        lightstring += '  Model:<br>'
        lightstring += `    Id:             ${light.model.id}<br>`
        lightstring += `    Manufacturer:   ${light.model.manufacturer}<br>`
        lightstring += `    Name:           ${light.model.name}<br>`
        lightstring += `    Type:           ${light.model.type}<br>`
        lightstring += `    Color Gamut:    ${light.model.colorGamut}<br>`
        lightstring += `    Friends of Hue: ${light.model.friendsOfHue}<br>`
        lightstring += `  Software Version: ${light.softwareVersion}<br>`
        lightstring += '  State:<br>'
        lightstring += `    On:         ${light.on}<br>`
        lightstring += `    Reachable:  ${light.reachable}<br>`
        lightstring += `    Brightness: ${light.brightness}<br>`
        lightstring += `    Color mode: ${light.colorMode}<br>`
        lightstring += `    Hue:        ${light.hue}<br>`
        lightstring += `    Saturation: ${light.saturation}<br>`
        lightstring += `    X/Y:        ${light.xy[0]}, ${light.xy[1]}<br>`
        lightstring += `    Color Temp: ${light.colorTemp}<br>`
        lightstring += `    Alert:      ${light.alert}<br>`
        lightstring += `    Effect:     ${light.effect}<br>`
        lightstring += "<br><br>";
      }
      res.send(lightstring)
    });
  }

});
//old function will end up having its own route. like users
app.get('/savelight/:id/:hue/:brightness/:saturation/:enabled',function (req,res){

  let client = req.theclient;
  if(req.params.id){
    client.lights.getById(req.params.id)
    .then(light => {
      if(req.params.brightness && req.params.brightness != 'nochange') light.brightness = req.params.brightness;
      if(req.params.hue && req.params.hue != 'nochange') light.hue = req.params.hue;
      if(req.params.saturation  && req.params.saturation != 'nochange') light.saturation = req.params.saturation;
      if(typeof(req.params.enabled) != undefined && req.params.enabled != 'nochange') light.on = req.params.enabled;
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


module.exports = app;
