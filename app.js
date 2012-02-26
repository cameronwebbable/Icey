
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
var app = module.exports = express.createServer();
var github = require('./lib/github');
var everyauth = require('everyauth');

// Configuration
var pub = __dirname + '/public';

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(everyauth.middleware());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'stakes'}));
  app.use(app.router);
  app.use(express.static(pub));
});

everyauth.helpExpress(app);

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.post('/authenticate', routes.authenticate);
app.get('/project/:user/:id/:key', routes.getProject);
app.get('/issue/update/:user/:repo/:issue/:label/:key', routes.updateIssue);
app.get('/issue/close/:user/:repo/:issue/:key', routes.closeIssue);

// Server

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
