
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , everyauth = require('everyauth')
  , conf = require('./conf')
  , github = require('./lib/github');
var app = module.exports = express.createServer();



// Everyauth
everyauth.helpExpress(app);
everyauth.debug = true;
everyauth.github
  .appId(conf.github_dev.appId)
  .appSecret(conf.github_dev.appSecret)
  .scope('user,repo')
  .findOrCreateUser( function (sess, accessToken, accessTokenExtra, ghUser) {
      sess.uid = ghUser.id
      return ghUser.id
  })
  .redirectPath('/');
  
everyauth.everymodule.handleLogout(function(req, res) {
  req.logout();
  req.session.uid = null;
  res.writeHead(303, { 'Location': this.logoutRedirectPath() });
  res.end();
});
everyauth.everymodule.logoutPath('/logout');
everyauth.everymodule.logoutRedirectPath('/');



// Configuration
var pub = __dirname + '/public';
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'stakes'}));
  app.use(app.router);
  app.use(everyauth.middleware());
  app.use(express.static(pub));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes

app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/authenticate', routes.authenticate);
app.get('/project/:user/:id/:key', routes.getProject);
app.get('/issue/update/:user/:repo/:issue/:label/:key', routes.updateIssue);
app.get('/issue/close/:user/:repo/:issue/:key', routes.closeIssue);

// Server

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
