// session resource
// TODO: POST   /session --> log in
// TODO: DELETE /session/me  --> log out


// user resource
var userSchema = {};

var getLoggedInUser = function(req, cb){
  cb(null, userRecord);
};

var createUser = function(req, res, userRecord, cb){
  // do some stuff to create a user here
  // any errors should be handled right here instead of cb()ing
  cb(userRecord);
};

var login = function(req, res, cb){
  var sessionid = 1234;
  cb(null, sessionid);
};

exports.handler = {

  GET : function(req, res){
    getLoggedInUser(req, res, function(err, userRecord){
      if (userRecord){
        res.object({})
          .link("account", req.uri.child("me"))
          .send();
      } else {
        res.object({})
          .link("create", req.uri, {method:"POST", schema: userSchema})
          .send();
      }
    });
  },

  POST : function(req, res){
    getLoggedInUser(req, res, function(err, userRecord){
      // make sure they're not logged in
      if (!userRecord){
        return res.status.forbidden("You can't create a new user while you're currently logged in.");
      } else {
        req.onJson(userSchema, function(err, obj){
          // create the user
          createUser(req, res, obj, function(user){
            // log them in
            login(req, function(err, sessionid){
              if (err){
                throw err;
              }
              res.status.created(req.uri.child("me"));
            });

          });
        });
      }
    });
  }

};


exports.wildcard = {
  GET : function(req, res){
    // show user record
    req.object(req.authenticated).send();
  },
  PUT : function(req, res){
    // update user record
    // TODO
  },
  DELETE : function(req, res){
    // remove account
    // TODO
  },
  authenticate : function(req, res, cb){
    getLoggedInUser(req, res, function(err, userRecord){
      if (err) { 
        throw err; 
      }
      if (userRecord){
        return cb(null, userRecord);
      } else {
        return cb(true);
      }
    });
  }
};

