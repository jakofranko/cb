var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cb');
var db = mongoose.connection;

// ROUTES
// ---------------------------------------
var api              = require('./routes/api');
var characters       = require('./routes/characters');
var dashboard        = require('./routes/dashboard');
var index            = require('./routes/index');
var martialManeuvers = require('./routes/martialManeuvers');
var perks            = require('./routes/perks');
var powers           = require('./routes/powers');
var skills           = require('./routes/skills');
var talents          = require('./routes/talents');
var users            = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'nyan cats and bulldobs'
}));

// Static routes (for Bower componenents and things like that)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'bower_components/bootstrap/dist'))); // Use Bootstrap stuff. This way, can compile to dist from bower_compoenents/bootstrap

app.use('/', index);
app.use('/api', api);
app.use('/users', users);
app.use('/characters', characters);
app.use('/dashboard', dashboard);
app.use('/skills', skills);
app.use('/martialManeuvers', martialManeuvers);
app.use('/perks', perks);
app.use('/talents', talents);
app.use('/powers', powers);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    app.listen(3000);
    console.log("and, we're on!");
});