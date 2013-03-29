var _ = require('underscore');
var Percolator = require('Percolator').Percolator;
var BasicAuthenticateHelper = require('Percolator').BasicAuthenticateHelper;

// TODO make status man do conneg
// TODO producers of app/json should respond to requests for app/blah+json
// TODO get a specific mediatype in there
// TODO don't use in/out for mediatype handlers
// == low priority ==
// TODO better error output when there's an error in mediaTypes, resources, etc.
// TODO better way to see all routes


var app = {
  protocol : 'http',
  resourcePath : '/api',
  staticDir : __dirname + '/static',
  port : 8080
};

var server = new Percolator(app);
server.before(function(req, res, handler, cb){
  req.started = new Date();
  BasicAuthenticateHelper(req, res, handler, function(){
    cb();
  });
});

server.after(function(req, res, handler){
  console.log(' <-- ', req.method, ' ', req.url, ' | duration: ' + (new Date() - req.started) + ' ms');
});

var resourceDir = __dirname + '/resources';
server.routeDirectory(resourceDir, app.resourcePath, function(err){
  console.log("routed resources in " + resourceDir);

  server.route('/inside', 
                      { GET : function(req, res){ 
                                res.end("muahahah!"); 
                              }
                      });
  if (err) {
    console.log("Routing error");
    console.log(err);
    return;
  }
  server.on("response", function(data){
    console.log("response");
    console.log(data);
  });
  server.on("errorResponse", function(data){
    console.log("error response");
    console.log(data.req.method, data.req.url, data.type, data.message, data.detail);
  });
  server.listen(function(err){
    if (err) {console.log(err);throw err;}
    console.log('Percolator running on ' + server.port);
  });
});
