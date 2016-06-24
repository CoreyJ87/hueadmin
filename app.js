var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var huejay = require('huejay');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var routes = require('./routes/index');
var users = require('./routes/users');
var savelight = require('./routes/savelight');

const debug=true;
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
  //Check if creds file exists
  fs.stat('./creds', function(err, stat) {
    if(err == null) {
      //Since the creds file does exist. Grab userid/ip from creds file and instantiate client. Attach client to request.
      var user='';
      var deviceIP='';

      console.log('Creds file exists. Reading userID');
      fs.readFileAsync("./creds", "utf8").then((fileData)=>{
        let parsedFileData=JSON.parse(fileData);
        deviceIP=parsedFileData.deviceIP;
        user=parsedFileData.user;
      });

      if (debug) console.log(`returned: ${user}`)

      req.theclient = new huejay.Client({
        host:     deviceIP,
        username: user
      });

      if(debug) console.log(req.theclient);

      next();
    } else if(err.code == 'ENOENT') {
      Client.searchForDevices().then((deviceIP) => {
        deviceIP = (deviceIP != undefined) ? deviceIP : `192.168.1.158`;
        Client.createUser(deviceIP).then((user) =>{
          if(debug) console.log(`We got back: ${user} from the user creation. With a device ip of ${deviceIP}`)

          //User does not exist now we create and instantiate new client /w created user. Then attach client to the request.
          if(user != undefined){
            req.theclient = new huejay.Client({
              host:     deviceIP,
              username: user
            });

            if(debug) console.log(req.theclient);
            next();
          }
          else {
            res.send('link button not pressed');
          }
        });
      })
    } else {
      console.log('Some other error: ', err.code);
      res.send('Somethings fucky');
    }
  })
});


app.use('/', routes);
app.use('/users', users);
app.use('/savelight',savelight);
app.use('/getlightinfo',getlightinfo);

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

module.exports = app;
