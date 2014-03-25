
/**
 * Module dependencies.
 */
 
require( './models/offer'); 
require('./models/user');//for mongoose. Require this first!!!

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '288659191291603';
var FACEBOOK_APP_SECRET = '8cf0f1e3a9bd26ffce42b1e4a299b4ac';

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3333); // Sets the port number
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3333/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    //Assuming user exists
    done(null, profile);
  });
}));

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
process.env.MONGOLAB_URI ||
'mongodb://heroku_app22855319:fo5rk0qdt48o1m9ng9ktdespsk@ds033559.mongolab.com:33559/heroku_app22855319'
process.env.MONGOHQ_URL ||
'mongodb://localhost/dinex_db';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Specifies Routes
app.get('/', routes.splash);
app.get('/newsfeed',routes.newsfeed);
app.get('/new',routes.create_form);
app.get('/offer/:id',routes.show_offer);
app.get('/dashboard/:id',routes.user_dashboard);
app.get('/logout',routes.logout);
app.get('/success',routes.login_success);
app.get('/error',routes.login_error);

//Facebook Login
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/success',
  failureRedirect: '/error'
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//Create Routes
app.post('/create', routes.create);
app.post('/create_user',routes.create_user);

//Update Route
app.get('/edit/:id',routes.get_edit_form);
app.get('/update/:id',routes.update_offer)

//Delete Routes
app.get('/delete/:id', routes.delete_offer);

// Specifies address on localhost
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
