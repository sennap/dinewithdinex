
/**
 * Module dependencies.
 */
 
require( './models/offer'); //for mongoose. Require this first!!!

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3333); // Sets the port number
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

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
app.post( '/create', routes.create );

// Specifies address on localhost
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
