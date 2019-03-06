var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://an%40foxyninjastudios.com:fnsrgb2016an@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Asset Ninja" <an@foxyninjastudios.com>', // sender address
    //to: '',
    to: 'an@foxyninjastudios.com',
    bcc: 'an@foxyninjastudios.com',
    subject: 'Password reset',
    //html: '',
    text: 'Your password has been reset.\n\n\n --- \n The Asset Ninja Team\n https://assetninja.xyz'
};

var url = require("url"),
	bcrypt = require("bcrypt-nodejs");
	querystring = require("querystring");
var User       = require('./models/user');
module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
/*
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });
*/

    app.get('/loginStatus', function(req, res) {
      if (req.isAuthenticated())
        res.send(JSON.stringify(req.user));
      else
        res.send("0");
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/logoutadmin', function(req, res) {
        req.logout();
        res.redirect('/admin');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
/*
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });
*/

        app.post('/tryLogin', passport.authenticate('local-login', {
            successRedirect : '/index.html', // redirect to the secure profile section
            failureRedirect : '/login.html#fail', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


        app.post('/loginADOps', passport.authenticate('local-login', {
            successRedirect : '/ops.html', // redirect to the secure profile section
            failureRedirect : '/loginOps.html#fail', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


        app.post('/loginADUser', passport.authenticate('local-login', {
            successRedirect : '/index.html', // redirect to the secure profile section
            failureRedirect : '/login.html#fail', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

/*

app.post('/loginADAdmin', function(req, res, next) {
    passport.authenticate('local-login', function(error, user, info) {
        if(error) {
            return res.status(500).json(error);
        }
        if(!user) {
            return res.status(401).json(info.message);
        }
        res.json(user);
    })(req, res, next);
});

*/

app.get('/loginFailure', function(req, res, next) {
  res.send('0');
});

app.get('/loginSuccess', function(req, res, next) {
  res.send('1');
});
/*
              // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

*/
        // process the signup form
        app.post('/tryRegister', passport.authenticate('local-signup', {
            successRedirect : '/index.html', // redirect to the secure profile section
            failureRedirect : '/signup.html#fail', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

  app.get('/changepass', isLoggedIn, function (req, res) {
    var incoming = url.parse(req.url).query;
    var info = querystring.parse(incoming);
       var user = req.user;
       var newpass = info.newpass;
       var oldpass = info.oldpass;
       if (user.validPassword(oldpass)){
         //user.local.password = newpass;
         user.local.password = bcrypt.hashSync(newpass, bcrypt.genSaltSync(8), null);
         user.save(function(err){
             if (err) { 
               res.send("issue");
             }
             else {
               res.send("1");
             }
         });
       }
       else{
           res.send("0");
       }
  });



  app.get('/resetpass', function (req, res) {
    var incoming = url.parse(req.url).query;
    var info = querystring.parse(incoming);
    User.findOne({ 'local.email' :  info.id }, function(err, user) {
      if(user){
         user.local.password = bcrypt.hashSync(info.pass, bcrypt.genSaltSync(8), null);
         var tk = info.tk;
         db.collection('userID').findOne({id:info.id}, function(err, result) {
           if(result){
             if(result.lostPToken && result.lostPToken == tk && result.lostPTS && result.lostPTS - new Date().getTime() < 2*60*60*1000){
             user.save(function(err){
                 if (err) { 
                   res.send("0");
                 }
                 else {
                   res.send("1");
                   result.lostPToken = "";
                   db.collection("userID").save(result, function(e,r){
                     mailOptions.to = info.id;
                      transporter.sendMail(mailOptions, function(error, info){
                          if(error){
                              return console.log(error);
                          }
                          //console.log('Message sent: ' + info.response);
                      }); 

                    });
                 }
             });
            }
            else{
              res.send("0");
            }
          }
          else{
            res.send("0");
          }
        });
      }
      else{
        res.send("0");
      }
    });
  });


    app.get('/isUserLoggedIn', isLoggedIn, function(req, res) {
      var keys = Object.keys(req);
      if(req.isAuthenticated() && keys.indexOf("user") >= 0){
        res.send(req.user);
      }
      else{
        res.send("0");
      }
    });

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

