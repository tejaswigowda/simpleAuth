var url = require("url"),
	querystring = require("querystring");
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
