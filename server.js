var url = require("url"),
	querystring = require("querystring");


function sendPushAndroid(token, message, topro){
	if(token.length < 150){
		return;
	}
	var params = {
		Token:token,
		PlatformApplicationArn:"arn:aws:sns:us-west-1:042386502333:app/GCM/CARESapp.me"
	};
	var temp1 = message.replace(/\n/g,"");
	if(temp1.length > 140){
		temp1 = temp1.substring(0,140) + " ...";
	}

	var apnsmessage = {
			data: {
				message: temp1
			}
	 };
	 var temp = {
		default: temp1,
		GCM: JSON.stringify(apnsmessage)
		}
	 var forapple = JSON.stringify(temp);

	sns.createPlatformEndpoint(params, function (err, data) {
		  if (err) {
		      console.log("err"); // an error occurred
		      console.log(err); // an error occurred
		  }
		  else {
		      sns.publish({TargetArn:data.EndpointArn, Message:forapple, MessageStructure: 'json' }, function(err,data){console.log(data);console.log(err);  });

		  }
	});

}


function sendPush(token, message, topro){
	console.log(token);
	console.log(message);
	if(token.length != 64){
		sendPushAndroid(token, message, topro);
		return;
	}
	var params;
    console.log(topro);
    if(!topro){
        params = {
            Token:token,
            PlatformApplicationArn:"arn:aws:sns:us-west-1:042386502333:app/APNS_SANDBOX/CARES"
        };
    }
    else{
        params = {
            Token:token,
            PlatformApplicationArn:"arn:aws:sns:us-west-1:042386502333:app/APNS_SANDBOX/CARESPRO"
        };
    }
	var temp1 = message.replace(/\n/g,"");
	if(temp1.length > 140){
		temp1 = temp1.substring(0,140) + " ...";
	}

	var apnsmessage = {
			aps: {
				alert: temp1,
				badge: 1,
				sound: "ping.aiff"
			}
	 };
	 var temp = {
		default: temp1,
		APNS_SANDBOX: JSON.stringify(apnsmessage),
		APNS: JSON.stringify(apnsmessage)
		}
	 var forapple = JSON.stringify(temp);

	sns.createPlatformEndpoint(params, function (err, data) {
		  if (err) {
		      console.log(err); // an error occurred
		  }
		  else {
		      sns.publish({TargetArn:data.EndpointArn, Message:forapple, MessageStructure: 'json' }, function(err,data){console.log(data);console.log(err);});
		  }
	});

}


var mongoose = require('morgan');
var passport = require('passport');
var flash    = require('connect-flash');
var fs = require('fs');
var path = require('path'),
express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');

var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);



var secret = 'mySecretCode' + new Date().getTime().toString()
  app.use(bodyParser({limit:'15mb'}));
  app.use(methodOverride());
  app.use(require("cookie-parser")(secret));

  app.use(session( {store: new MongoStore({
          url: 'mongodb://127.0.0.1:27017/test',
          secret: secret
        })}));
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions

  app.use(express.static(path.join(__dirname, 'public')));


var mongoose = require('mongoose');
var configDB = require('./passport/config/database.js');
mongoose.connect(configDB.url); // connect to our database

require('./passport/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./passport/config/passport')(passport); // pass passport for configuration

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send('noauth');
}


app.listen(8080);
