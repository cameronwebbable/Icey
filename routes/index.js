var github = require('../lib/github');

exports.index = function(req, res){
  res.render('index', { title: 'Icey' });
};

exports.authenticate = function(req, res) {
    var gh = github
    gh.authenticate(req.body.username, req.body.apikey);
    gh.getUserApi().show(req.body.username, function(err, info) {
        gh.getRepoApi().getUserRepos(req.body.username, function(err, resp) {
          var responseObj = {infoobj: info, repos: resp};
          res.send(responseObj);
        });
    });
};

exports.getProject = function(req, res) {
  var gh = github
  gh.authenticate(req.params.user, req.params.key);
  gh.getIssueApi().getList(req.params.user, req.params.id, 'open', function(err, info) {
    gh.getRepoApi().getUserRepos(req.params.user, function(err, resp) {
      var responseObj = { title: 'Icey | '+req.params.id, user: req.params.user, key: req.params.key, pname: req.params.id, content: info, repos: resp};
      console.log(responseObj)
      res.render('project', responseObj);
    });
  });
};